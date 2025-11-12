# Verify P12 Certificate and Generate Base64 for GitHub Secrets
# Run this script to verify your certificate and get the Base64 for GitHub

param(
    [Parameter(Mandatory=$true)]
    [string]$P12Path,
    
    [string]$Password = "Quillwill7&!"
)

Write-Host "=== P12 Certificate Verification and Base64 Encoding ===" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $P12Path)) {
    Write-Host "ERROR: File not found at: $P12Path" -ForegroundColor Red
    exit 1
}

# 1) Check size (helps match CI logs)
$fileSize = ([IO.File]::ReadAllBytes($P12Path)).Length
Write-Host "File: $P12Path" -ForegroundColor Green
Write-Host "Size: $fileSize bytes" -ForegroundColor Green
Write-Host ""

# 2) Verify password and print cert info
Write-Host "Verifying password..." -ForegroundColor Yellow
$certOutput = certutil -p $Password -dump $P12Path 2>&1
$certExitCode = $LASTEXITCODE

if ($certExitCode -eq 0) {
    Write-Host "✓ Password is CORRECT" -ForegroundColor Green
    Write-Host ""
    Write-Host "Certificate details:" -ForegroundColor Cyan
    $certOutput | Select-String -Pattern "Subject|Issuer|Serial|NotBefore|NotAfter|CertUtil" | ForEach-Object { 
        if ($_.Line -notmatch "CertUtil: -dump command completed successfully") {
            Write-Host $_.Line 
        }
    }
    Write-Host ""
} else {
    Write-Host "✗ Password is INCORRECT or file is corrupt" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error output:" -ForegroundColor Yellow
    $certOutput | ForEach-Object { Write-Host $_ }
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. The password is correct: $Password" -ForegroundColor Yellow
    Write-Host "  2. The file is not corrupted" -ForegroundColor Yellow
    Write-Host "  3. You're using the correct .p12 file" -ForegroundColor Yellow
    exit 1
}

# 3) Generate Base64 and copy to clipboard
Write-Host "Generating Base64..." -ForegroundColor Yellow
$base64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($P12Path))
$base64 | Set-Clipboard

Write-Host "✓ Base64 encoded and copied to clipboard!" -ForegroundColor Green
Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to: https://github.com/r0bay/Latest-Version-of-AITA/settings/secrets/actions" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Update these secrets:" -ForegroundColor Yellow
Write-Host "   - CERT_P12_BASE64 → Paste from clipboard (Ctrl+V)" -ForegroundColor White
Write-Host "   - P12_PASSWORD → Quillwill7&!" -ForegroundColor White
Write-Host ""
Write-Host "3. Save both secrets (no leading/trailing spaces)" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. File size to verify in CI logs: $fileSize bytes" -ForegroundColor Cyan
Write-Host "   (The CI log should show the same size)" -ForegroundColor Gray
Write-Host ""
