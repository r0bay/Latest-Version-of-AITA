# Encode Codemagic Secrets
# This script encodes the .p12 certificate and .mobileprovision file to base64

Write-Host "=== Encoding Codemagic Secrets ===" -ForegroundColor Cyan
Write-Host ""

# Check for no-password certificate first, then fall back to password-protected
$certPathNoPass = "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new_nopassword.p12"
$certPath = "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new.p12"
$profilePath = "C:\Users\rrwil\Desktop\New API KEY\RandomAITAFinal_AppStore_New.mobileprovision"

# Prefer no-password certificate if it exists
if (Test-Path $certPathNoPass) {
    $certPath = $certPathNoPass
    $hasPassword = $false
    Write-Host "Using no-password certificate: $certPath" -ForegroundColor Green
} else {
    $hasPassword = $true
    Write-Host "Using password-protected certificate: $certPath" -ForegroundColor Yellow
    Write-Host "To create a no-password certificate, run: .\remove_certificate_password.ps1" -ForegroundColor Gray
}
Write-Host ""

# Verify files exist
if (-not (Test-Path $certPath)) {
    Write-Host "ERROR: Certificate file not found: $certPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $profilePath)) {
    Write-Host "ERROR: Provisioning profile not found: $profilePath" -ForegroundColor Red
    exit 1
}

Write-Host "1. Encoding certificate (.p12)..." -ForegroundColor Yellow
$certBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($certPath))
$certBase64 | Set-Clipboard
Write-Host "   ✓ Certificate encoded and copied to clipboard" -ForegroundColor Green
Write-Host "   → Use this for: CERT_P12_BASE64" -ForegroundColor White
Write-Host ""

Write-Host "2. Encoding provisioning profile (.mobileprovision)..." -ForegroundColor Yellow
$profileBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($profilePath))
$profileBase64 | Set-Clipboard
Write-Host "   ✓ Profile encoded and copied to clipboard" -ForegroundColor Green
Write-Host "   → Use this for: MOBILEPROVISION_BASE64" -ForegroundColor White
Write-Host ""

Write-Host "=== Codemagic Environment Variables ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Add these to Codemagic Settings -> Environment Variables -> ios_signing group:" -ForegroundColor White
Write-Host ""
Write-Host "1. CERT_P12_BASE64" -ForegroundColor Yellow
Write-Host "   Value: (Certificate base64 is in clipboard - paste it)" -ForegroundColor White
Write-Host ""
Write-Host "2. P12_PASSWORD" -ForegroundColor Yellow
if ($hasPassword) {
    Write-Host "   Value: RandomAITA2024" -ForegroundColor White
} else {
    Write-Host "   Value: (leave empty or delete this variable)" -ForegroundColor Green
}
Write-Host ""
Write-Host "3. MOBILEPROVISION_BASE64" -ForegroundColor Yellow
Write-Host "   Value: (Profile base64 is in clipboard - paste it)" -ForegroundColor White
Write-Host ""
Write-Host "4. PROFILE_NAME" -ForegroundColor Yellow
Write-Host "   Value: RandomAITAFinal_AppStore_New" -ForegroundColor White
Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
if ($hasPassword) {
    Write-Host "Password: RandomAITA2024" -ForegroundColor Green
} else {
    Write-Host "Password: (none - certificate has no password)" -ForegroundColor Green
}
Write-Host "Profile Name: RandomAITAFinal_AppStore_New" -ForegroundColor Green
Write-Host ""
Write-Host "NOTE: The certificate base64 is in your clipboard." -ForegroundColor Yellow
Write-Host "      After pasting it to Codemagic, run this script again to get the profile base64." -ForegroundColor Yellow
Write-Host ""

