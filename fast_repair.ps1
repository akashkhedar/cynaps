# repair_deploy.ps1
$ErrorActionPreference = "Stop"

$VM_NAME = "cynaps-monolith"
$ZONE = "asia-south1-a"

# 0. Build Frontend Locally (skip if already built)
Write-Host "Checking frontend build..." -ForegroundColor Cyan
if (-not (Test-Path "web\dist\apps\cynaps\index.html")) {
    Write-Host "Building frontend locally..." -ForegroundColor Cyan
    Push-Location web
    try {
        yarn cynaps:build
        if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }
    } finally {
        Pop-Location
    }
    Write-Host "Frontend build complete!" -ForegroundColor Green
} else {
    Write-Host "Frontend already built, skipping..." -ForegroundColor Green
}

# 1. Get VM IP & Generate Config (Essential for valid source.zip)
Write-Host "Fetching VM IP..." -ForegroundColor Yellow
$VM_IP = gcloud compute instances describe $VM_NAME --zone=$ZONE --format="value(networkInterfaces[0].accessConfigs[0].natIP)"
if ([string]::IsNullOrWhiteSpace($VM_IP)) { Write-Error "Could not get VM IP"; exit 1 }
Write-Host "VM IP: $VM_IP"

Write-Host "Generating production.env..." -ForegroundColor Yellow
$envContent = Get-Content ".env"
$prodEnvContent = @()
foreach ($line in $envContent) {
    if ($line -match "^DEBUG=") { $line = "DEBUG=False" }
    if ($line -match "^POSTGRE_HOST=") { $line = "POSTGRE_HOST=db" }
    if ($line -match "^REDIS_HOST=") { $line = "REDIS_HOST=redis" }
    # Map Django env vars to Docker Postgres vars
    if ($line -match "^POSTGRE_USER=(.*)") { $prodEnvContent += "POSTGRES_USER=$($matches[1])" }
    if ($line -match "^POSTGRE_PASSWORD=(.*)") { $prodEnvContent += "POSTGRES_PASSWORD=$($matches[1])" }
    if ($line -match "^POSTGRE_NAME=(.*)") { $prodEnvContent += "POSTGRES_DB=$($matches[1])" }

    if ($line -match "^STORAGE_AWS_ENDPOINT_URL=") { $line = "STORAGE_AWS_ENDPOINT_URL=http://$($VM_IP):9000" }
    if ($line -match "^FRONTEND_HOSTNAME=") { $line = "FRONTEND_HOSTNAME=/static" }

    # Domain configuration (cynaps.xyz + IP)
    # Remove port 8080 from allowed hosts and CORS for standard port 80 access
    if ($line -match "^ALLOWED_HOSTS=") { $line = "ALLOWED_HOSTS=localhost,127.0.0.1,$VM_IP,cynaps.xyz,www.cynaps.xyz" }
    
    # CORS: Allow both port 80 (implied) and 8080 just in case
    if ($line -match "^CORS_ALLOWED_ORIGINS=") { $line = "CORS_ALLOWED_ORIGINS=http://localhost:8080,http://$($VM_IP):8080,http://$($VM_IP):9000,http://cynaps.xyz,https://cynaps.xyz" }
    
    # Add CSRF Trusted Origins for the domain (no port needed for 80/443)
    $prodEnvContent += "CSRF_TRUSTED_ORIGINS=http://cynaps.xyz,https://cynaps.xyz,http://www.cynaps.xyz,https://www.cynaps.xyz,http://$($VM_IP):8080"
    
    $prodEnvContent += $line
}
$prodEnvContent | Set-Content "production.env"

# 2. Package and Upload Source (TARGETED - only what's needed)
Write-Host "Packaging source (only essential files)..." -ForegroundColor Yellow
$tempDir = "temp_deploy_pkg_repair"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue }
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy ONLY what's needed for deployment (fast and small)
Write-Host "  Copying cynaps backend..." -ForegroundColor Gray
robocopy cynaps "$tempDir\cynaps" /E /XD __pycache__ .pytest_cache /XF *.pyc /R:0 /W:0 /NJH /NJS /NDL /NC /NP

Write-Host "  Copying cynaps-sdk..." -ForegroundColor Gray
robocopy cynaps-sdk "$tempDir\cynaps-sdk" /E /XD __pycache__ .pytest_cache tests /XF *.pyc /R:0 /W:0 /NJH /NJS /NDL /NC /NP

Write-Host "  Copying built frontend (dist only)..." -ForegroundColor Gray
robocopy "web\dist" "$tempDir\web\dist" /E /R:0 /W:0 /NJH /NJS /NDL /NC /NP

# Copy config files
Write-Host "  Copying config files..." -ForegroundColor Gray
Copy-Item "Dockerfile.prod" -Destination "$tempDir\" -Force
Copy-Item "docker-compose.prod.yml" -Destination "$tempDir\" -Force
Copy-Item "pyproject.toml" -Destination "$tempDir\" -Force
Copy-Item "poetry.lock" -Destination "$tempDir\" -Force
Copy-Item "README.md" -Destination "$tempDir\" -Force
Copy-Item "production.env" -Destination "$tempDir\" -Force
if (Test-Path "Caddyfile") { Copy-Item "Caddyfile" -Destination "$tempDir\" -Force }
if (Test-Path "MANIFEST.in") { Copy-Item "MANIFEST.in" -Destination "$tempDir\" -Force }

# Verify frontend build artifacts
if (-not (Test-Path "$tempDir\web\dist\apps\cynaps")) {
    Write-Error "Frontend build artifacts not found! Run 'yarn cynaps:build' in web/ first."
    exit 1
}
Write-Host "Frontend build artifacts included." -ForegroundColor Green

# Zip it
if (Test-Path "source.zip") { Remove-Item "source.zip" -Force }
Write-Host "Zipping..." -ForegroundColor Yellow
Compress-Archive -Path "$tempDir\*" -DestinationPath "source.zip" -Force
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Uploading source.zip to VM..." -ForegroundColor Yellow
gcloud compute scp source.zip ${VM_NAME}:./source.zip --zone=$ZONE --quiet

Write-Host "Creating local repair script..." -ForegroundColor Cyan

# We write the bash script to a file first.
# Note: usage of `tr -d '\r'` on the VM ensures Windows line endings from PowerShell don't break bash.
$bashScriptContent = @'
#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive

echo "=== 1. System Prep ==="
sudo apt-get update
sudo apt-get install -y curl unzip

echo "=== 2. Docker Check ==="
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "Docker installed."
else
    echo "Docker already installed."
fi

echo "=== 3. Redeploying ==="
# Cleanup potential locks from failed installs
sudo rm -rf /var/lib/apt/lists/lock
sudo rm -rf /var/cache/apt/archives/lock || true

# Prepare directory
rm -rf cynaps-deploy
mkdir cynaps-deploy
unzip -o ~/source.zip -d cynaps-deploy
cd cynaps-deploy

echo "Stopping existing containers..."
sudo docker compose -f docker-compose.prod.yml down --remove-orphans || true

echo "Starting containers..."
sudo docker compose -f docker-compose.prod.yml up -d --build

echo "=== Repair Complete ==="
'@

# Save to local file
Out-File -FilePath "repair_vm.sh" -InputObject $bashScriptContent -Encoding UTF8 -Force

Write-Host "Uploading repair script to VM..." -ForegroundColor Yellow
gcloud compute scp repair_vm.sh ${VM_NAME}:./repair_vm.sh --zone=$ZONE --quiet

Write-Host "Executing repair script on VM..." -ForegroundColor Yellow
# Critical: Pipe through tr to remove CR characters from Windows-created file
$remoteCommand = "tr -d '\r' < repair_vm.sh > repair_fixed.sh && chmod +x repair_fixed.sh && ./repair_fixed.sh"
gcloud compute ssh $VM_NAME --zone=$ZONE --command=$remoteCommand

Write-Host "Updating Firewall Rules (Allow 80, 443)..." -ForegroundColor Yellow
gcloud compute firewall-rules update allow-cynaps-ports --allow="tcp:80,tcp:443,tcp:8080,tcp:9000,tcp:9001"


Write-Host "---------------------------------------------------"
Write-Host "Repair finished. Please verify access at http://34.93.63.53:8080" -ForegroundColor Green
Write-Host "---------------------------------------------------"
