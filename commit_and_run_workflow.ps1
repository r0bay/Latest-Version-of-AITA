# Commit workflow fix and trigger GitHub Actions
# This script commits the OpenSSL PEM import fix and triggers the workflow

$ErrorActionPreference = "Stop"

Write-Host "=== Commit & Trigger Workflow ===" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: Not in a git repository" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please navigate to your git repository root and run:" -ForegroundColor Yellow
    Write-Host "  cd C:\path\to\Latest-Version-of-AITA" -ForegroundColor White
    Write-Host "  .\commit_and_run_workflow.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "Or manually run:" -ForegroundColor Yellow
    Write-Host "  git add .github/workflows/ios_testflight.yml" -ForegroundColor White
    Write-Host "  git commit -m `"fix(ci): import iOS signing cert via OpenSSL PEM to bypass PKCS#12 MAC bug`"" -ForegroundColor White
    Write-Host "  git push origin main" -ForegroundColor White
    exit 1
}

# Verify workflow file exists
if (-not (Test-Path ".github\workflows\ios_testflight.yml")) {
    Write-Host "ERROR: Workflow file not found" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Git repository found" -ForegroundColor Green
Write-Host "✓ Workflow file found" -ForegroundColor Green
Write-Host ""

# Commit and push
Write-Host "Committing workflow fix..." -ForegroundColor Yellow
git add .github/workflows/ios_testflight.yml
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: git add failed" -ForegroundColor Red
    exit 1
}

git commit -m "fix(ci): import iOS signing cert via OpenSSL PEM to bypass PKCS#12 MAC bug"
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: git commit failed (maybe no changes?)" -ForegroundColor Yellow
} else {
    Write-Host "✓ Committed" -ForegroundColor Green
}

Write-Host "Pushing to origin main..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: git push failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Pushed" -ForegroundColor Green
Write-Host ""

# Check for GitHub CLI
$GH = "$env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe"
if (-not (Test-Path $GH)) {
    Write-Host "GitHub CLI not found. Install with:" -ForegroundColor Yellow
    Write-Host "  winget install --id GitHub.cli -e" -ForegroundColor White
    Write-Host ""
    Write-Host "After installing, trigger the workflow manually:" -ForegroundColor Yellow
    Write-Host "  & `$GH workflow run `"iOS TestFlight`" --ref main --repo r0bay/Latest-Version-of-AITA" -ForegroundColor White
    Write-Host "  & `$GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA" -ForegroundColor White
    exit 0
}

# Check for GitHub token
if (-not $env:GH_TOKEN) {
    Write-Host "GH_TOKEN not set. Set it with:" -ForegroundColor Yellow
    Write-Host "  `$env:GH_TOKEN = 'ghp_yourPersonalAccessTokenHere'" -ForegroundColor White
    Write-Host ""
    Write-Host "Or trigger manually from:" -ForegroundColor Yellow
    Write-Host "  https://github.com/r0bay/Latest-Version-of-AITA/actions" -ForegroundColor White
    exit 0
}

# Authenticate
Write-Host "Authenticating with GitHub..." -ForegroundColor Yellow
$env:GH_TOKEN | & $GH auth login --with-token 2>&1 | Out-Null
Write-Host "✓ Authenticated" -ForegroundColor Green
Write-Host ""

# Trigger workflow
Write-Host "Triggering workflow: iOS TestFlight" -ForegroundColor Yellow
& $GH workflow run "iOS TestFlight" --ref main --repo r0bay/Latest-Version-of-AITA
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to trigger workflow" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Workflow triggered" -ForegroundColor Green
Write-Host ""

# Watch the run
Write-Host "Watching workflow run (press Ctrl+C to stop)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "=== What to look for in logs ===" -ForegroundColor Cyan
Write-Host "In 'Create keychain & import certificate' step:" -ForegroundColor White
Write-Host "  ✓ openssl ... -info passes (no error)" -ForegroundColor Green
Write-Host "  ✓ subject= line printed for /tmp/dist_cert.cer" -ForegroundColor Green
Write-Host "  ✓ security find-identity lists an Apple Distribution identity" -ForegroundColor Green
Write-Host "  ✗ Should NOT see: MAC verification failed" -ForegroundColor Red
Write-Host ""
& $GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA

