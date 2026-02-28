# quick_deploy.ps1 - Fast deployment script for Cynaps to GCP
# This script updates code and restarts containers without full rebuild

$ErrorActionPreference = "Stop"
$PROJECT = "synapse-485809"
$ZONE = "asia-south1-a"
$VM = "cynaps-monolith"

Write-Host "=== Cynaps Quick Deploy ===" -ForegroundColor Cyan

# Step 1: Set gcloud config
Write-Host "[1/6] Configuring gcloud..." -ForegroundColor Yellow
gcloud config set project $PROJECT 2>$null
$account = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
Write-Host "Using account: $account"

# Step 2: Verify VM is running
Write-Host "[2/6] Checking VM status..." -ForegroundColor Yellow
$status = gcloud compute instances describe $VM --zone=$ZONE --format="value(status)" 2>$null
if ($status -ne "RUNNING") {
    Write-Host "Starting VM..." -ForegroundColor Yellow
    gcloud compute instances start $VM --zone=$ZONE
    Start-Sleep -Seconds 30
}
Write-Host "VM is RUNNING" -ForegroundColor Green

# Step 3: Upload updated files
Write-Host "[3/6] Uploading files to VM..." -ForegroundColor Yellow

$filesToUpload = @(
    "production.env",
    "Caddyfile",
    "cynaps/core/views.py",
    "cynaps/core/urls.py"
)

foreach ($file in $filesToUpload) {
    $localPath = Join-Path $PSScriptRoot $file
    if (Test-Path $localPath) {
        $remotePath = "/tmp/" + (Split-Path $file -Leaf)
        Write-Host "  Uploading $file..."
        gcloud compute scp $localPath "${VM}:${remotePath}" --zone=$ZONE --project=$PROJECT 2>$null
    }
}
Write-Host "Files uploaded" -ForegroundColor Green

# Step 4: Copy files on server and update containers
Write-Host "[4/6] Updating server files..." -ForegroundColor Yellow

$updateScript = @'
cd ~/deploy_app

# Copy config files
cp /tmp/production.env ./production.env 2>/dev/null || true
cp /tmp/Caddyfile ./Caddyfile 2>/dev/null || true

# Copy source files to deploy directory
cp /tmp/views.py cynaps/core/views.py 2>/dev/null || true
cp /tmp/urls.py cynaps/core/urls.py 2>/dev/null || true

# Also copy to running container
sudo docker cp /tmp/views.py cynaps-platform:/app/cynaps/core/views.py 2>/dev/null || true
sudo docker cp /tmp/urls.py cynaps-platform:/app/cynaps/core/urls.py 2>/dev/null || true

echo "Files updated"
'@

gcloud compute ssh $VM --zone=$ZONE --project=$PROJECT --command=$updateScript
Write-Host "Server files updated" -ForegroundColor Green

# Step 5: Restart containers with updated env
Write-Host "[5/6] Restarting containers..." -ForegroundColor Yellow

$restartScript = @'
cd ~/deploy_app
sudo docker compose -f docker-compose.prod.yml --env-file production.env up -d --force-recreate app rq-worker caddy 2>&1 | tail -20
echo "Containers restarted"
'@

gcloud compute ssh $VM --zone=$ZONE --project=$PROJECT --command=$restartScript
Write-Host "Containers restarted" -ForegroundColor Green

# Step 6: Wait and verify
Write-Host "[6/6] Verifying deployment (waiting 60s for startup)..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

$verifyScript = @'
echo "=== Container Status ==="
sudo docker ps --format "table {{.Names}}\t{{.Status}}" | head -10
echo ""
echo "=== Latest Logs ==="
sudo docker logs --tail 5 cynaps-platform 2>&1 | grep -E "gunicorn|Listening|Booting|Error" || echo "Server starting..."
'@

gcloud compute ssh $VM --zone=$ZONE --project=$PROJECT --command=$verifyScript

# Test endpoint
Write-Host ""
Write-Host "Testing https://cynaps.xyz..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://cynaps.xyz/" -UseBasicParsing -TimeoutSec 30
    Write-Host "Homepage: $($response.StatusCode) OK" -ForegroundColor Green
} catch {
    Write-Host "Homepage: Still starting up or error" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Cyan
Write-Host "URL: https://cynaps.xyz" -ForegroundColor Green
Write-Host "MinIO: http://34.14.200.56:9001" -ForegroundColor Green
