# Get Clean Certificate Base64 for Codemagic
# This script generates a clean base64 string with no line breaks or spaces

$certPath = "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new_nopassword.p12"
$outputFile = "C:\Users\rrwil\Desktop\New API KEY\certificate_base64_clean.txt"

Write-Host "=== Generating Clean Certificate Base64 ===" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $certPath)) {
    Write-Host "ERROR: Certificate file not found: $certPath" -ForegroundColor Red
    exit 1
}

# Read certificate and encode to base64
Write-Host "Reading certificate file..." -ForegroundColor Yellow
$certBytes = [IO.File]::ReadAllBytes($certPath)
$certBase64 = [Convert]::ToBase64String($certBytes)

# Remove any whitespace (shouldn't be any, but just in case)
$certBase64 = $certBase64 -replace '\s', ''

# Write to file (ASCII encoding, no BOM, no newline)
# Use Set-Content with -NoNewline to ensure single line
Set-Content -Path $outputFile -Value $certBase64 -NoNewline -Encoding ASCII

# Also copy to clipboard
$certBase64 | Set-Clipboard

Write-Host "✓ Certificate encoded successfully" -ForegroundColor Green
Write-Host ""
Write-Host "File size: $($certBytes.Length) bytes" -ForegroundColor Yellow
Write-Host "Base64 length: $($certBase64.Length) characters" -ForegroundColor Yellow
Write-Host ""
Write-Host "Output saved to: $outputFile" -ForegroundColor Cyan
Write-Host "Base64 also copied to clipboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "=== Instructions ===" -ForegroundColor Cyan
Write-Host "1. Open the file: $outputFile" -ForegroundColor White
Write-Host "2. Select ALL (Ctrl+A) and copy (Ctrl+C)" -ForegroundColor White
Write-Host "3. In Codemagic, edit CERT_P12_BASE64 variable" -ForegroundColor White
Write-Host "4. DELETE all existing content" -ForegroundColor Yellow
Write-Host "5. Paste the new base64 (should be one continuous line)" -ForegroundColor White
Write-Host "6. Make sure P12_PASSWORD variable is DELETED or empty" -ForegroundColor Yellow
Write-Host ""
Write-Host "The base64 is also in your clipboard - you can paste it directly!" -ForegroundColor Green
Write-Host ""

