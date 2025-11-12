# Verify Certificate Password Locally
# This script helps verify the certificate and password before uploading to Codemagic

$certPath = "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new.p12"
$password = "RandomAITA2024"

Write-Host "=== Verifying Certificate Locally ===" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $certPath)) {
    Write-Host "ERROR: Certificate file not found: $certPath" -ForegroundColor Red
    exit 1
}

Write-Host "Certificate file: $certPath" -ForegroundColor Yellow
Write-Host "Password: $password" -ForegroundColor Yellow
Write-Host ""

# Check if OpenSSL is available
$opensslPath = where.exe openssl 2>$null
if (-not $opensslPath) {
    Write-Host "WARNING: OpenSSL not found in PATH" -ForegroundColor Yellow
    Write-Host "Install OpenSSL or use Git Bash to verify the certificate" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To verify in Git Bash, run:" -ForegroundColor White
    Write-Host "  openssl pkcs12 -info -in `"$certPath`" -passin pass:$password -noout" -ForegroundColor Gray
    exit 0
}

Write-Host "1. Verifying certificate with OpenSSL..." -ForegroundColor Yellow
Write-Host ""

# Verify the certificate
$verifyCommand = "openssl pkcs12 -info -in `"$certPath`" -passin pass:$password -noout 2>&1"
$verifyResult = Invoke-Expression $verifyCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Certificate verification successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Certificate details:" -ForegroundColor Cyan
    Write-Host $verifyResult
    Write-Host ""
} else {
    Write-Host "✗ Certificate verification FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error output:" -ForegroundColor Yellow
    Write-Host $verifyResult
    Write-Host ""
    Write-Host "Possible causes:" -ForegroundColor Yellow
    Write-Host "1. Wrong password - verify the password is: $password" -ForegroundColor White
    Write-Host "2. Corrupted certificate file" -ForegroundColor White
    Write-Host "3. Certificate was exported with a different password" -ForegroundColor White
    exit 1
}

# Calculate SHA256 hash
Write-Host "2. Calculating SHA256 hash..." -ForegroundColor Yellow
$fileBytes = [System.IO.File]::ReadAllBytes($certPath)
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$hashBytes = $sha256.ComputeHash($fileBytes)
$hashString = [System.BitConverter]::ToString($hashBytes).Replace("-", "").ToLower()

Write-Host "Certificate SHA256: $hashString" -ForegroundColor Green
Write-Host ""
Write-Host "You can compare this hash with the one shown in Codemagic build logs" -ForegroundColor Cyan
Write-Host "(Look for 'Decoded P12 SHA256: ...' in the build output)" -ForegroundColor Cyan
Write-Host ""

# Re-encode to base64
Write-Host "3. Generating clean base64..." -ForegroundColor Yellow
$certBase64 = [Convert]::ToBase64String($fileBytes)
$certBase64 | Set-Clipboard

Write-Host "✓ Base64 copied to clipboard" -ForegroundColor Green
Write-Host "Length: $($certBase64.Length) characters" -ForegroundColor Yellow
Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "✓ Certificate file exists" -ForegroundColor Green
Write-Host "✓ Password verification successful" -ForegroundColor Green
Write-Host "✓ SHA256 hash calculated: $hashString" -ForegroundColor Green
Write-Host "✓ Base64 ready for Codemagic (in clipboard)" -ForegroundColor Green
Write-Host ""
Write-Host "Next step: Update CERT_P12_BASE64 in Codemagic with the base64 from clipboard" -ForegroundColor Yellow
Write-Host ""





