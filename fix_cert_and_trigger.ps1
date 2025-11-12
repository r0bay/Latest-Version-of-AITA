# Fix Certificate and Trigger GitHub Actions Workflow
# This script verifies the certificate, updates GitHub Secrets, and triggers the workflow

param(
    [string]$GitHubToken = $env:GH_TOKEN
)

$ErrorActionPreference = "Stop"

Write-Host "=== Certificate Fix and Workflow Trigger ===" -ForegroundColor Cyan
Write-Host ""

# 1) Verify the certificate file
$P12 = "C:\Users\rrwil\Desktop\provisioning profile\ios_distribution.p12"

if (-not (Test-Path $P12)) {
    Write-Host "ERROR: Certificate file not found at: $P12" -ForegroundColor Red
    exit 1
}

$size = ([IO.File]::ReadAllBytes($P12)).Length
Write-Host "Certificate file: $P12" -ForegroundColor Green
Write-Host "Size: $size bytes" -ForegroundColor Green

if ($size -ne 3348) {
    Write-Host "WARNING: Size is $size, expected 3348. Continuing anyway..." -ForegroundColor Yellow
}

Write-Host "Verifying password..." -ForegroundColor Yellow
$certResult = certutil -p "Quillwill7&!" -dump $P12 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Password verification failed!" -ForegroundColor Red
    $certResult | ForEach-Object { Write-Host $_ }
    exit 1
}
Write-Host "✓ Password verified" -ForegroundColor Green
Write-Host ""

# 2) Generate Base64
Write-Host "Generating Base64..." -ForegroundColor Yellow
$B64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($P12))
Write-Host "✓ Base64 generated (length: $($B64.Length) chars)" -ForegroundColor Green
Write-Host ""

# 3) Check GitHub CLI
$GH = "$env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe"
if (-not (Test-Path $GH)) {
    Write-Host "ERROR: GitHub CLI not found at: $GH" -ForegroundColor Red
    Write-Host "Install it with: winget install --id GitHub.cli -e" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found GitHub CLI: $GH" -ForegroundColor Green

# 4) Authenticate if needed
if (-not $GitHubToken) {
    Write-Host "ERROR: GH_TOKEN environment variable not set" -ForegroundColor Red
    Write-Host "Set it with: `$env:GH_TOKEN = 'ghp_yourPersonalAccessTokenHere'" -ForegroundColor Yellow
    Write-Host "Or pass it as: .\fix_cert_and_trigger.ps1 -GitHubToken 'ghp_...'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Authenticating with GitHub..." -ForegroundColor Yellow
$env:GH_TOKEN = $GitHubToken
$GitHubToken | & $GH auth login --with-token 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Auth check failed, but continuing..." -ForegroundColor Yellow
}
Write-Host "✓ Authenticated" -ForegroundColor Green
Write-Host ""

# 5) Update GitHub Secrets
Write-Host "Updating GitHub Secrets..." -ForegroundColor Yellow
Write-Host "  → CERT_P12_BASE64" -ForegroundColor Cyan
$B64 | & $GH secret set CERT_P12_BASE64 --repo r0bay/Latest-Version-of-AITA --body - 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to update CERT_P12_BASE64" -ForegroundColor Red
    exit 1
}

Write-Host "  → P12_PASSWORD" -ForegroundColor Cyan
"Quillwill7&!" | & $GH secret set P12_PASSWORD --repo r0bay/Latest-Version-of-AITA --body - 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to update P12_PASSWORD" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Secrets updated" -ForegroundColor Green
Write-Host ""

# 6) Trigger workflow
Write-Host "Triggering workflow: iOS TestFlight" -ForegroundColor Yellow
& $GH workflow run "iOS TestFlight" --ref main --repo r0bay/Latest-Version-of-AITA 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to trigger workflow" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Workflow triggered" -ForegroundColor Green
Write-Host ""

# 7) Watch the run
Write-Host "Watching workflow run (press Ctrl+C to stop watching)..." -ForegroundColor Yellow
Write-Host ""
& $GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA

