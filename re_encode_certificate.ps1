# Re-encode Certificate for Codemagic
# This script creates a clean base64 file without any encoding issues

$certPath = "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new.p12"
$outputPath = "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new.p12.base64.txt"

Write-Host "=== Re-encoding Certificate ===" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $certPath)) {
    Write-Host "ERROR: Certificate file not found: $certPath" -ForegroundColor Red
    exit 1
}

Write-Host "1. Reading certificate file..." -ForegroundColor Yellow
$certBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($certPath))

Write-Host "2. Writing to file (ASCII encoding)..." -ForegroundColor Yellow
[System.IO.File]::WriteAllText($outputPath, $certBase64, [System.Text.Encoding]::ASCII)

Write-Host "3. Copying to clipboard..." -ForegroundColor Yellow
$certBase64 | Set-Clipboard

Write-Host ""
Write-Host "Certificate re-encoded successfully" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Open the file: $outputPath" -ForegroundColor White
Write-Host "2. Copy ONLY the base64 text (no quotes, no spaces)" -ForegroundColor White
Write-Host "3. Paste into Codemagic CERT_P12_BASE64" -ForegroundColor White
Write-Host ""
Write-Host "OR: The base64 is already in your clipboard - paste it directly" -ForegroundColor Yellow
Write-Host ""
Write-Host "Password to use in Codemagic: RandomAITA2024" -ForegroundColor Green
Write-Host ""
