# Export Certificate with Password
# This script helps you re-export your certificate with a password using OpenSSL

Write-Host "=== Export Certificate with Password ===" -ForegroundColor Cyan
Write-Host ""

$certPathNoPass = "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new_nopassword.p12"
$outputPath = "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new_with_password.p12"
$password = "RandomAITA2024"

$openssl = "C:\Program Files\Git\usr\bin\openssl.exe"

if (-not (Test-Path $certPathNoPass)) {
    Write-Host "ERROR: Certificate file not found: $certPathNoPass" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $openssl)) {
    Write-Host "ERROR: OpenSSL not found at: $openssl" -ForegroundColor Red
    Write-Host "Please install Git for Windows or OpenSSL" -ForegroundColor Yellow
    exit 1
}

Write-Host "1. Extracting certificate and private key from no-password p12..." -ForegroundColor Yellow

# Create temporary files
$tempCert = [System.IO.Path]::GetTempFileName()
$tempKey = [System.IO.Path]::GetTempFileName()

try {
    # Extract certificate
    Write-Host "   Extracting certificate..." -ForegroundColor Gray
    $extractCertCmd = "& `"$openssl`" pkcs12 -in `"$certPathNoPass`" -passin pass: -clcerts -nokeys -out `"$tempCert`" 2>&1"
    Invoke-Expression $extractCertCmd | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to extract certificate"
    }
    
    # Extract private key
    Write-Host "   Extracting private key..." -ForegroundColor Gray
    $extractKeyCmd = "& `"$openssl`" pkcs12 -in `"$certPathNoPass`" -passin pass: -nocerts -nodes -out `"$tempKey`" 2>&1"
    Invoke-Expression $extractKeyCmd | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to extract private key"
    }
    
    # Create new p12 with password
    Write-Host "2. Creating new p12 file with password..." -ForegroundColor Yellow
    $createP12Cmd = "& `"$openssl`" pkcs12 -export -in `"$tempCert`" -inkey `"$tempKey`" -out `"$outputPath`" -passout pass:`"$password`" 2>&1"
    Invoke-Expression $createP12Cmd | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create password-protected certificate"
    }
    
    # Verify the new certificate
    Write-Host "3. Verifying new certificate..." -ForegroundColor Yellow
    $verifyCmd = "& `"$openssl`" pkcs12 -in `"$outputPath`" -passin pass:`"$password`" -nokeys -info -noout 2>&1"
    Invoke-Expression $verifyCmd | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        throw "New certificate verification failed"
    }
    
    Write-Host "   ✓ Certificate created successfully" -ForegroundColor Green
    Write-Host ""
    
    # Encode to base64
    Write-Host "4. Encoding certificate to base64..." -ForegroundColor Yellow
    $certBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($outputPath))
    $certBase64 | Set-Clipboard
    
    Write-Host "   ✓ Certificate encoded and copied to clipboard" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "=== Success ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "New certificate created: $outputPath" -ForegroundColor White
    Write-Host "Password: $password" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Update Codemagic environment variables:" -ForegroundColor White
    Write-Host "   - CERT_P12_BASE64: (base64 is in clipboard - paste it)" -ForegroundColor Gray
    Write-Host "   - P12_PASSWORD: $password" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. The certificate base64 is already in your clipboard." -ForegroundColor Yellow
    Write-Host "   Just paste it into Codemagic's CERT_P12_BASE64 field." -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Conversion failed. Please check the error messages above." -ForegroundColor Yellow
    exit 1
} finally {
    # Clean up temporary files
    if (Test-Path $tempCert) { Remove-Item $tempCert -Force -ErrorAction SilentlyContinue }
    if (Test-Path $tempKey) { Remove-Item $tempKey -Force -ErrorAction SilentlyContinue }
}


