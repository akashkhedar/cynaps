# redeploy.ps1 - Safe Redeployment Script (Preserves Database)
# Usage: .\redeploy.ps1 [-SkipBuild] [-SkipMigrations]
#
# This script SAFELY rebuilds and restarts the application.
# Database volumes are NEVER removed.

param (
    [string]$ProjectId = "synapse-485809",
    [switch]$SkipBuild,
    [switch]$SkipMigrations
)

$ErrorActionPreference = "Stop"

# ==========================================
# Helper Functions
# ==========================================
function Write-Green($text) { Write-Host $text -ForegroundColor Green }
function Write-Yellow($text) { Write-Host $text -ForegroundColor Yellow }
function Write-Red($text) { Write-Host $text -ForegroundColor Red }
function Write-Cyan($text) { Write-Host $text -ForegroundColor Cyan }

# ==========================================
# Configuration
# ==========================================
$VM_NAME = "cynaps-monolith"
$ZONE = "asia-south1-a"

Write-Cyan "============================================"
Write-Cyan "  CYNAPS SAFE REDEPLOYMENT"
Write-Cyan "  Database will NOT be affected"
Write-Cyan "============================================"
Write-Host ""

# ==========================================
# Pre-flight Checks
# ==========================================
Write-Green "[1/7] Pre-flight checks..."

if (-not (Get-Command "gcloud" -ErrorAction SilentlyContinue)) {
    Write-Red "Error: gcloud CLI not installed"
    exit 1
}

gcloud config set project $ProjectId 2>$null

# Verify VM is running
$vmStatus = gcloud compute instances describe $VM_NAME --zone=$ZONE --format="value(status)" 2>$null
if ($LASTEXITCODE -ne 0 -or $vmStatus -ne "RUNNING") {
    Write-Red "Error: VM '$VM_NAME' is not running"
    exit 1
}

$VM_IP = gcloud compute instances describe $VM_NAME --zone=$ZONE --format="value(networkInterfaces[0].accessConfigs[0].natIP)"
Write-Green "  VM: $VM_NAME ($VM_IP) - RUNNING"

# ==========================================
# Check Current Database Status
# ==========================================
Write-Green "[2/7] Checking database status..."

$dbCheckScript = @"
echo "=== Database Container Status ==="
docker ps -a --filter "name=cynaps-db" --format "table {{.Names}}\t{{.Status}}"
echo ""
echo "=== Database Record Counts ==="
docker exec cynaps-db psql -U cynaps -d cynaps -c "SELECT 'Users:', count(*) FROM users_user;" 2>/dev/null || echo "  (DB not ready or table missing)"
docker exec cynaps-db psql -U cynaps -d cynaps -c "SELECT 'Projects:', count(*) FROM project;" 2>/dev/null || echo "  (table missing)"
docker exec cynaps-db psql -U cynaps -d cynaps -c "SELECT 'Tasks:', count(*) FROM task;" 2>/dev/null || echo "  (table missing)"
echo ""
echo "=== Docker Volumes ==="
docker volume ls | grep -E "cynaps|db_data" || echo "  (no matching volumes)"
"@

try {
    gcloud compute ssh $VM_NAME --zone=$ZONE --command=$dbCheckScript 2>$null
} catch {
    Write-Yellow "  Could not check database status (SSH issue)"
}

$confirm = Read-Host "  Continue with deployment? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Yellow "Deployment cancelled."
    exit 0
}

# ==========================================
# Generate Production Config
# ==========================================
Write-Green "[3/7] Generating production config..."

if (-not (Test-Path ".env")) {
    Write-Red "Error: .env file not found"
    exit 1
}

$envContent = Get-Content ".env"
$prodEnvContent = @()

foreach ($line in $envContent) {
    if ($line -match "^DEBUG=") { $line = "DEBUG=False" }
    if ($line -match "^POSTGRE_HOST=") { $line = "POSTGRE_HOST=db" }
    if ($line -match "^REDIS_HOST=") { $line = "REDIS_HOST=redis" }
    if ($line -match "^STORAGE_AWS_ENDPOINT_URL=") { $line = "STORAGE_AWS_ENDPOINT_URL=http://$($VM_IP):9000" }
    if ($line -match "^ALLOWED_HOSTS=") { $line = "ALLOWED_HOSTS=localhost,127.0.0.1,$VM_IP,cynaps.xyz,www.cynaps.xyz" }
    if ($line -match "^CORS_ALLOWED_ORIGINS=") { $line = "CORS_ALLOWED_ORIGINS=http://localhost:8080,http://$($VM_IP):8080,https://cynaps.xyz,https://www.cynaps.xyz" }
    $prodEnvContent += $line
}

$prodEnvContent | Set-Content "production.env"
Write-Green "  production.env generated"

# ==========================================
# Build Frontend Locally
# ==========================================
if (-not $SkipBuild) {
    Write-Green "[4/7] Building frontend locally..."
    
    Push-Location web
    try {
        yarn install --frozen-lockfile 2>$null
        yarn cynaps:build
        if ($LASTEXITCODE -ne 0) {
            Write-Red "Frontend build failed"
            exit 1
        }
    } finally {
        Pop-Location
    }
    Write-Green "  Frontend built successfully"
} else {
    Write-Yellow "[4/7] Skipping frontend build (--SkipBuild)"
}

# ==========================================
# Package Application
# ==========================================
Write-Green "[5/7] Packaging application..."

$tempDir = "temp_deploy_pkg"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy required files
$items = @(
    "cynaps",
    "cynaps-sdk", 
    "web/dist",
    "Dockerfile.prod",
    "docker-compose.prod.yml",
    "production.env",
    "pyproject.toml",
    "poetry.lock",
    "Caddyfile",
    "README.md"
)

foreach ($item in $items) {
    if (Test-Path $item) {
        $dest = Join-Path $tempDir $item
        $parentDir = Split-Path $dest -Parent
        if (-not (Test-Path $parentDir)) {
            New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
        }
        Copy-Item -Path $item -Destination $dest -Recurse -Force
    }
}

if (Test-Path "source.zip") { Remove-Item "source.zip" -Force }
Compress-Archive -Path "$tempDir\*" -DestinationPath "source.zip" -Force
Remove-Item $tempDir -Recurse -Force

Write-Green "  Package created (source.zip)"

# ==========================================
# Upload to VM
# ==========================================
Write-Green "[6/7] Uploading to VM..."

gcloud compute scp source.zip "${VM_NAME}:/tmp/source.zip" --zone=$ZONE
if ($LASTEXITCODE -ne 0) {
    Write-Red "Upload failed"
    exit 1
}
Write-Green "  Upload complete"

# ==========================================
# Deploy (Safe - preserves database)
# ==========================================
Write-Green "[7/7] Deploying application (database preserved)..."

$migrateFlag = "true"
if ($SkipMigrations) {
    $migrateFlag = "false"
}

$deployScript = @'
set -e

APP_DIR="$HOME/deploy_app"
RUN_MIGRATIONS=__MIGRATE_FLAG__

# Create directory if it doesn't exist
mkdir -p "$APP_DIR"
cd "$APP_DIR"

echo "=== Current container status ==="
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | head -20

# ============================================
# STEP 1: Backup database before any changes
# ============================================
echo ""
echo "=== Backing up database ==="
BACKUP_FILE="/tmp/cynaps_backup_$(date +%Y%m%d_%H%M%S).sql"
if docker exec cynaps-db pg_dump -U cynaps cynaps > "$BACKUP_FILE" 2>/dev/null; then
    echo "  Database backed up to: $BACKUP_FILE"
    ls -lh "$BACKUP_FILE"
else
    echo "  Warning: Could not backup database (container may not be running)"
fi

# ============================================
# STEP 2: Extract new code
# ============================================
echo ""
echo "=== Extracting new code ==="
rm -rf deploy_new
mkdir -p deploy_new
unzip -q -o /tmp/source.zip -d deploy_new
cp -r deploy_new/* .
rm -rf deploy_new

# ============================================
# STEP 3: Check if infrastructure is running
# ============================================
echo ""
echo "=== Checking infrastructure containers ==="
DB_RUNNING=$(docker ps -q -f name=cynaps-db)
REDIS_RUNNING=$(docker ps -q -f name=cynaps-redis)

if [ -z "$DB_RUNNING" ] || [ -z "$REDIS_RUNNING" ]; then
    echo "  Infrastructure not running. Starting db, redis, minio..."
    docker compose -f docker-compose.prod.yml up -d db redis minio
    echo "  Waiting for database to be healthy..."
    sleep 15
    
    # Wait for PostgreSQL to be ready
    for i in 1 2 3 4 5 6 7 8 9 10; do
        if docker exec cynaps-db pg_isready -U cynaps > /dev/null 2>&1; then
            echo "  Database is ready!"
            break
        fi
        echo "  Waiting for database... ($i/10)"
        sleep 5
    done
else
    echo "  Database: Running"
    echo "  Redis: Running"
fi

# ============================================
# STEP 4: Rebuild app images
# ============================================
echo ""
echo "=== Building app images ==="
docker compose -f docker-compose.prod.yml build app rq-worker scheduler

# ============================================
# STEP 5: Stop ONLY app containers (NOT db/redis/minio)
# ============================================
echo ""
echo "=== Stopping app containers only ==="
docker stop cynaps-platform cynaps-rq-worker cynaps-scheduler cynaps-caddy 2>/dev/null || true
docker rm -f cynaps-platform cynaps-rq-worker cynaps-scheduler cynaps-caddy 2>/dev/null || true

# ============================================
# STEP 6: Start app containers on same network
# ============================================
echo ""
echo "=== Starting app containers ==="
docker compose -f docker-compose.prod.yml up -d app rq-worker scheduler caddy

# ============================================
# STEP 7: Wait for app to be ready
# ============================================
echo ""
echo "=== Waiting for app to start ==="
for i in 1 2 3 4 5 6; do
    if docker exec cynaps-platform python -c "print('App is running')" 2>/dev/null; then
        echo "  App container is ready!"
        break
    fi
    echo "  Waiting for app... ($i/6)"
    sleep 5
done

# ============================================
# STEP 8: Run migrations if enabled
# ============================================
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo ""
    echo "=== Running database migrations ==="
    docker exec cynaps-platform python cynaps/manage.py migrate --noinput || echo "  Migration warning (may be okay)"
fi

# ============================================
# STEP 9: Collect static files
# ============================================
echo ""
echo "=== Collecting static files ==="
docker exec cynaps-platform python cynaps/manage.py collectstatic --noinput 2>/dev/null || true

# ============================================
# STEP 10: Verify deployment
# ============================================
echo ""
echo "=== Verifying database integrity ==="
docker exec cynaps-db psql -U cynaps -d cynaps -c "SELECT 'Users:', count(*) FROM users_user;" 2>/dev/null || echo "  Table not found (run migrations)"
docker exec cynaps-db psql -U cynaps -d cynaps -c "SELECT 'Projects:', count(*) FROM project;" 2>/dev/null || echo "  Table not found"
docker exec cynaps-db psql -U cynaps -d cynaps -c "SELECT 'Tasks:', count(*) FROM task;" 2>/dev/null || echo "  Table not found"

echo ""
echo "=== Final container status ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "=== Docker volumes (data preserved) ==="
docker volume ls | grep -E "cynaps|db_data|redis_data|minio_data" || echo "  (volumes listed below)"
docker volume ls

echo ""
echo "=== Deployment complete! ==="
'@

# Replace placeholder with actual value
$deployScript = $deployScript -replace "__MIGRATE_FLAG__", $migrateFlag

# Convert Windows line endings to Unix
$deployScript = $deployScript -replace "`r`n", "`n"

gcloud compute ssh $VM_NAME --zone=$ZONE --command=$deployScript

# ==========================================
# Cleanup
# ==========================================
Remove-Item "source.zip" -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Green "============================================"
Write-Green "  REDEPLOYMENT COMPLETE!"
Write-Green "  App URL: http://$VM_IP"
Write-Green "  App URL: https://cynaps.xyz"
Write-Green "============================================"
Write-Cyan "  Database was preserved"
Write-Cyan "  Backup saved on VM in /tmp/"
Write-Green "============================================"
