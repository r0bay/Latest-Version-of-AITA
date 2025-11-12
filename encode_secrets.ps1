# Encode Codemagic Secrets

$certPath = "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new.p12"
$profilePath = "C:\Users\rrwil\Desktop\New API KEY\RandomAITAFinal_AppStore_New.mobileprovision"

Write-Host "=== Encoding Certificate ===" -ForegroundColor Cyan
$certBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($certPath))
$certBase64 | Set-Clipboard
Write-Host "CERT_P12_BASE64 copied to clipboard" -ForegroundColor Green
Write-Host ""

Write-Host "=== Encoding Provisioning Profile ===" -ForegroundColor Cyan
$profileBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($profilePath))
Write-Host "MOBILEPROVISION_BASE64:" -ForegroundColor Yellow
Write-Host $profileBase64 -ForegroundColor White
Write-Host ""

Write-Host "=== Codemagic Environment Variables ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. CERT_P12_BASE64" -ForegroundColor Yellow
Write-Host "   Value: (in clipboard - paste it)" -ForegroundColor White
Write-Host ""
Write-Host "2. P12_PASSWORD" -ForegroundColor Yellow
Write-Host "   Value: RandomAITA2024" -ForegroundColor White
Write-Host ""
Write-Host "3. MOBILEPROVISION_BASE64" -ForegroundColor Yellow
Write-Host "   Value: (shown above - copy it)" -ForegroundColor White
Write-Host ""
Write-Host "4. PROFILE_NAME" -ForegroundColor Yellow
Write-Host "   Value: RandomAITAFinal_AppStore_New" -ForegroundColor White
Write-Host ""





