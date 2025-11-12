# Run Workflow Fix - Commit and Trigger
# Update the REPO_PATH variable below with your actual repository path

$REPO_PATH = "C:\path\to\Latest-Version-of-AITA"  # ⚠️ UPDATE THIS PATH

Write-Host "=== Commit & Trigger Workflow ===" -ForegroundColor Cyan
Write-Host ""

# Check if repo path is still placeholder
if ($REPO_PATH -eq "C:\path\to\Latest-Version-of-AITA") {
    Write-Host "ERROR: Please update REPO_PATH in this script with your actual repository path" -ForegroundColor Red
    Write-Host ""
    Write-Host "To find your repo, run:" -ForegroundColor Yellow
    Write-Host "  Get-ChildItem -Path `$env:USERPROFILE -Filter '.git' -Directory -Recurse -ErrorAction SilentlyContinue | Select-Object FullName" -ForegroundColor White
    exit 1
}

# 1) Go to repo
Write-Host "1. Navigating to repository..." -ForegroundColor Yellow
if (-not (Test-Path $REPO_PATH)) {
    Write-Host "ERROR: Repository path not found: $REPO_PATH" -ForegroundColor Red
    exit 1
}
Set-Location $REPO_PATH
Write-Host "   ✓ In repository: $REPO_PATH" -ForegroundColor Green
Write-Host ""

# 2) Copy updated workflow
Write-Host "2. Copying updated workflow file..." -ForegroundColor Yellow
$sourceFile = "C:\Users\rrwil\Desktop\AITA Project - Copy\.github\workflows\ios_testflight.yml"
$destFile = ".github\workflows\ios_testflight.yml"

if (-not (Test-Path $sourceFile)) {
    Write-Host "ERROR: Source workflow file not found: $sourceFile" -ForegroundColor Red
    exit 1
}

# Ensure destination directory exists
$destDir = Split-Path $destFile -Parent
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

Copy-Item $sourceFile -Destination $destFile -Force
Write-Host "   ✓ Workflow file copied" -ForegroundColor Green
Write-Host ""

# 3) Commit & push
Write-Host "3. Committing and pushing..." -ForegroundColor Yellow
git add .github/workflows/ios_testflight.yml
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: git add failed" -ForegroundColor Red
    exit 1
}

git commit -m "fix(ci): import iOS signing cert via OpenSSL PEM to bypass PKCS#12 MAC bug"
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: git commit failed (maybe no changes?)" -ForegroundColor Yellow
} else {
    Write-Host "   ✓ Committed" -ForegroundColor Green
}

git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: git push failed" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ Pushed to origin/main" -ForegroundColor Green
Write-Host ""

# 4) Trigger workflow and watch
Write-Host "4. Triggering workflow..." -ForegroundColor Yellow
$GH = "$env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe"

if (-not (Test-Path $GH)) {
    Write-Host "ERROR: GitHub CLI not found. Install with: winget install --id GitHub.cli -e" -ForegroundColor Red
    exit 1
}

# Check for token
if (-not $env:GH_TOKEN) {
    Write-Host "WARNING: GH_TOKEN not set. Set it with:" -ForegroundColor Yellow
    Write-Host "  `$env:GH_TOKEN = 'ghp_yourPersonalAccessTokenHere'" -ForegroundColor White
    Write-Host ""
    Write-Host "Triggering workflow anyway (may prompt for auth)..." -ForegroundColor Yellow
}

& $GH workflow run "iOS TestFlight" --ref main --repo r0bay/Latest-Version-of-AITA
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to trigger workflow" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ Workflow triggered" -ForegroundColor Green
Write-Host ""

Write-Host "5. Watching workflow run..." -ForegroundColor Yellow
Write-Host ""
Write-Host "=== What to look for in logs ===" -ForegroundColor Cyan
Write-Host "In 'Create keychain & import certificate' step:" -ForegroundColor White
Write-Host "  ✓ openssl ... -info passes (no error)" -ForegroundColor Green
Write-Host "  ✓ subject= line printed for /tmp/dist_cert.cer" -ForegroundColor Green
Write-Host "  ✓ security find-identity lists an Apple Distribution identity" -ForegroundColor Green
Write-Host "  ✗ Should NOT see: MAC verification failed" -ForegroundColor Red
Write-Host ""

& $GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA

