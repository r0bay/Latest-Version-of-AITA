# Watch GitHub Actions Workflow
# This script authenticates GitHub CLI and watches the iOS TestFlight workflow

$ErrorActionPreference = "Stop"

Write-Host "=== GitHub Actions Workflow Watcher ===" -ForegroundColor Cyan
Write-Host ""

# Find GitHub CLI
$GH = "$env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe"
if (-not (Test-Path $GH)) {
    $GH = "C:\Program Files\GitHub CLI\gh.exe"
}
if (-not (Test-Path $GH)) {
    Write-Host "ERROR: GitHub CLI not found" -ForegroundColor Red
    Write-Host "Install with: winget install --id GitHub.cli -e" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Found GitHub CLI: $GH" -ForegroundColor Green
Write-Host ""

# 1) Auth once (token must have repo,workflow scopes)
Write-Host "=== Step 1: Authenticating ===" -ForegroundColor Cyan

if (-not $env:GH_TOKEN) {
    Write-Host "GH_TOKEN not set. Please provide your GitHub Personal Access Token." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To create a token:" -ForegroundColor White
    Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "  2. Generate new token (classic)" -ForegroundColor White
    Write-Host "  3. Select scopes: repo, workflow" -ForegroundColor White
    Write-Host "  4. Copy the token (starts with ghp_)" -ForegroundColor White
    Write-Host ""
    $token = Read-Host "Enter your GitHub Personal Access Token (or press Enter to skip auth if already logged in)"
    if ($token) {
        $env:GH_TOKEN = $token
    }
}

if ($env:GH_TOKEN) {
    Write-Host "Authenticating with token..." -ForegroundColor Yellow
    $env:GH_TOKEN | & $GH auth login --with-token 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Authenticated" -ForegroundColor Green
    } else {
        Write-Host "⚠ Authentication may have failed, but continuing..." -ForegroundColor Yellow
    }
} else {
    Write-Host "No token provided. Checking if already authenticated..." -ForegroundColor Yellow
    $authCheck = & $GH auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Already authenticated" -ForegroundColor Green
    } else {
        Write-Host "⚠ Not authenticated. Run: gh auth login" -ForegroundColor Yellow
    }
}

Write-Host ""

# 2) Stream the current/next run until it finishes
Write-Host "=== Step 2: Watching Workflow ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ What to look for in 'Create keychain & import certificate' step:" -ForegroundColor Green
Write-Host "  - subject= line for /tmp/dist_cert.cer" -ForegroundColor White
Write-Host "  - security find-identity -p codesigning lists an Apple Distribution identity" -ForegroundColor White
Write-Host "  - NO 'MAC verification failed'" -ForegroundColor White
Write-Host ""
Write-Host "Common upload step issues:" -ForegroundColor Yellow
Write-Host "  - 'No suitable application record' → Create app in App Store Connect" -ForegroundColor White
Write-Host "  - 'identical binary' → Build number already auto-bumped" -ForegroundColor White
Write-Host "  - API key permissions → Key must have App Manager or Admin" -ForegroundColor White
Write-Host ""
Write-Host "Watching workflow run (press Ctrl+C to stop)..." -ForegroundColor Yellow
Write-Host ""

& $GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "=== Workflow Failed ===" -ForegroundColor Red
    Write-Host ""
    Write-Host "To view full logs:" -ForegroundColor Yellow
    Write-Host "  & `$GH run view --repo r0bay/Latest-Version-of-AITA --log" -ForegroundColor White
    Write-Host ""
    Write-Host "Paste the last ~60 lines of the failing step for help." -ForegroundColor Cyan
}

