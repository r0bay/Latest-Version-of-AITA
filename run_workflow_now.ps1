# Quick script to authenticate and run the workflow
# Just set your GH_TOKEN and run this script

$ErrorActionPreference = "Stop"

$GH = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $GH)) {
    $GH = "$env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe"
}

if (-not (Test-Path $GH)) {
    Write-Host "ERROR: GitHub CLI not found" -ForegroundColor Red
    exit 1
}

# Check if token is set
if (-not $env:GH_TOKEN) {
    Write-Host "GH_TOKEN not set. Please set it first:" -ForegroundColor Yellow
    Write-Host "  `$env:GH_TOKEN = 'ghp_yourPersonalAccessTokenHere'" -ForegroundColor White
    Write-Host ""
    Write-Host "Or run interactive login:" -ForegroundColor Yellow
    Write-Host "  & `$GH auth login" -ForegroundColor White
    exit 1
}

# Authenticate
Write-Host "Authenticating..." -ForegroundColor Cyan
$env:GH_TOKEN | & $GH auth login --with-token 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Authentication failed. Check your token." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Authenticated" -ForegroundColor Green

# Trigger workflow
Write-Host ""
Write-Host "Triggering workflow..." -ForegroundColor Cyan
& $GH workflow run "iOS TestFlight" --ref main --repo r0bay/Latest-Version-of-AITA
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to trigger workflow" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Workflow triggered" -ForegroundColor Green

# Watch
Write-Host ""
Write-Host "Watching workflow run..." -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Look for in 'Create keychain & import certificate':" -ForegroundColor Green
Write-Host "  - subject= line for /tmp/dist_cert.cer" -ForegroundColor White
Write-Host "  - security find-identity listing Apple Distribution" -ForegroundColor White
Write-Host "  - NO 'MAC verification failed'" -ForegroundColor White
Write-Host ""

& $GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA

