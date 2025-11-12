# Trigger and Watch GitHub Actions Workflow
# This script authenticates, checks for running workflows, triggers if needed, and watches logs

$ErrorActionPreference = "Stop"

$GH = "$env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe"
if (-not (Test-Path $GH)) {
    $GH = "C:\Program Files\GitHub CLI\gh.exe"
}

if (-not (Test-Path $GH)) {
    Write-Host "ERROR: GitHub CLI not found" -ForegroundColor Red
    Write-Host "Install with: winget install --id GitHub.cli -e" -ForegroundColor Yellow
    exit 1
}

Write-Host "=== GitHub Actions Workflow Trigger & Watch ===" -ForegroundColor Cyan
Write-Host ""

# 1) Auth (PAT must have repo,workflow scopes)
Write-Host "=== Step 1: Authentication ===" -ForegroundColor Cyan

if (-not $env:GH_TOKEN) {
    Write-Host "GH_TOKEN not set. Please provide your GitHub Personal Access Token." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To create a token:" -ForegroundColor White
    Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "  2. Generate new token (classic)" -ForegroundColor White
    Write-Host "  3. Select scopes: repo, workflow" -ForegroundColor White
    Write-Host "  4. Copy the token (starts with ghp_)" -ForegroundColor White
    Write-Host ""
    $token = Read-Host "Enter your GitHub Personal Access Token (or press Enter to skip if already authenticated)"
    if ($token) {
        $env:GH_TOKEN = $token
    }
}

if ($env:GH_TOKEN) {
    Write-Host "Authenticating with token..." -ForegroundColor Yellow
    $env:GH_TOKEN | & $GH auth login --with-token 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Authenticated" -ForegroundColor Green
    } else {
        Write-Host "⚠ Authentication may have failed, checking status..." -ForegroundColor Yellow
    }
} else {
    Write-Host "No token provided. Checking if already authenticated..." -ForegroundColor Yellow
}

# Verify authentication
$authCheck = & $GH auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Not authenticated. Please set GH_TOKEN or run: gh auth login" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Authentication verified" -ForegroundColor Green
Write-Host ""

# 2) Check for running workflows
Write-Host "=== Step 2: Checking for running workflows ===" -ForegroundColor Cyan
$runs = & $GH run list --repo r0bay/Latest-Version-of-AITA --limit 5 --json status,conclusion,workflowName,number 2>&1 | ConvertFrom-Json

if ($runs -and $runs.Count -gt 0) {
    $latestRun = $runs[0]
    Write-Host "Latest run: #$($latestRun.number) - $($latestRun.workflowName) - Status: $($latestRun.status)" -ForegroundColor Cyan
    
    if ($latestRun.status -eq "in_progress" -or $latestRun.status -eq "queued") {
        Write-Host "✓ Found running/queued workflow" -ForegroundColor Green
        Write-Host "Watching existing run..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "✅ What to look for in 'Create keychain & import certificate' step:" -ForegroundColor Green
        Write-Host "  - subject= line for /tmp/dist_cert.cer" -ForegroundColor White
        Write-Host "  - security find-identity -p codesigning lists Apple Distribution" -ForegroundColor White
        Write-Host "  - NO 'MAC verification failed'" -ForegroundColor White
        Write-Host ""
        & $GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA
        exit $LASTEXITCODE
    } else {
        Write-Host "Latest run is $($latestRun.status). Will trigger a new run." -ForegroundColor Yellow
    }
} else {
    Write-Host "No recent runs found. Will trigger a new run." -ForegroundColor Yellow
}

Write-Host ""

# 3) Trigger and watch
Write-Host "=== Step 3: Triggering new workflow ===" -ForegroundColor Cyan
Write-Host "Triggering workflow: iOS TestFlight" -ForegroundColor Yellow
& $GH workflow run "iOS TestFlight" --ref main --repo r0bay/Latest-Version-of-AITA 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to trigger workflow" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Workflow triggered" -ForegroundColor Green
Write-Host ""

Write-Host "=== Step 4: Watching workflow run ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Success indicators in 'Create keychain & import certificate' step:" -ForegroundColor Green
Write-Host "  - subject= line for /tmp/dist_cert.cer" -ForegroundColor White
Write-Host "  - security find-identity -p codesigning lists Apple Distribution" -ForegroundColor White
Write-Host "  - NO 'MAC verification failed'" -ForegroundColor White
Write-Host ""
Write-Host "Streaming logs (press Ctrl+C to stop)..." -ForegroundColor Yellow
Write-Host ""

& $GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "=== Workflow Failed ===" -ForegroundColor Red
    Write-Host ""
    Write-Host "Useful commands:" -ForegroundColor Yellow
    Write-Host "  # List recent runs" -ForegroundColor White
    Write-Host "  & `$GH run list --repo r0bay/Latest-Version-of-AITA" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  # View last run's logs" -ForegroundColor White
    Write-Host "  & `$GH run view --repo r0bay/Latest-Version-of-AITA --log" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  # Tail a specific job" -ForegroundColor White
    Write-Host "  & `$GH run view --job 'Create keychain & import certificate' --repo r0bay/Latest-Version-of-AITA --log" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Paste the last ~60 lines of the failing step for help." -ForegroundColor Cyan
}

