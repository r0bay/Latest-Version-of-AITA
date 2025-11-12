# Remove Certificate Password
# This script converts a password-protected .p12 certificate to one without a password

Write-Host "=== Remove Certificate Password ===" -ForegroundColor Cyan
Write-Host ""

$certPath = "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new.p12"
$currentPassword = "RandomAITA2024"
$outputPath = "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new_nopassword.p12"

# Verify certificate file exists
if (-not (Test-Path $certPath)) {
    Write-Host "ERROR: Certificate file not found: $certPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please update the `$certPath variable in this script to point to your certificate." -ForegroundColor Yellow
    exit 1
}

Write-Host "Certificate file found: $certPath" -ForegroundColor Green
Write-Host "Current password: $currentPassword" -ForegroundColor Yellow
Write-Host "Output file: $outputPath" -ForegroundColor Yellow
Write-Host ""

# Check for OpenSSL
$opensslPath = $null

# Try to find OpenSSL in common locations
$possiblePaths = @(
    "openssl",
    "C:\Program Files\Git\usr\bin\openssl.exe",
    "C:\Program Files (x86)\Git\usr\bin\openssl.exe",
    "C:\OpenSSL-Win64\bin\openssl.exe",
    "C:\OpenSSL-Win32\bin\openssl.exe"
)

foreach ($path in $possiblePaths) {
    try {
        $result = Get-Command $path -ErrorAction SilentlyContinue
        if ($result) {
            $opensslPath = $result.Source
            break
        }
    } catch {
        # Try direct path
        if (Test-Path $path) {
            $opensslPath = $path
            break
        }
    }
}

# If still not found, try where.exe
if (-not $opensslPath) {
    try {
        $whereResult = where.exe openssl 2>$null
        if ($whereResult) {
            $opensslPath = $whereResult
        }
    } catch {
        # Ignore
    }
}

if (-not $opensslPath) {
    Write-Host "ERROR: OpenSSL not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "OpenSSL is required to convert the certificate." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Installation options:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Option 1: Install via Git for Windows (includes OpenSSL)" -ForegroundColor White
    Write-Host "  Download: https://git-scm.com/download/win" -ForegroundColor Gray
    Write-Host "  OpenSSL will be at: C:\Program Files\Git\usr\bin\openssl.exe" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 2: Install OpenSSL directly" -ForegroundColor White
    Write-Host "  Download: https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Gray
    Write-Host "  Or use Chocolatey: choco install openssl" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 3: Use WSL (Windows Subsystem for Linux)" -ForegroundColor White
    Write-Host "  If you have WSL, you can use: wsl openssl ..." -ForegroundColor Gray
    Write-Host ""
    Write-Host "After installing OpenSSL, run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "OpenSSL found: $opensslPath" -ForegroundColor Green
Write-Host ""

# Verify the certificate can be read with current password
Write-Host "1. Verifying certificate with current password..." -ForegroundColor Yellow
$verifyCmd = "& `"$opensslPath`" pkcs12 -in `"$certPath`" -passin pass:`"$currentPassword`" -nokeys -info -noout 2>&1"
$verifyResult = Invoke-Expression $verifyCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to verify certificate with password '$currentPassword'" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "  - Password is incorrect" -ForegroundColor White
    Write-Host "  - Certificate file is corrupted" -ForegroundColor White
    Write-Host ""
    Write-Host "Please verify:" -ForegroundColor Cyan
    Write-Host "  1. The password is correct: $currentPassword" -ForegroundColor White
    Write-Host "  2. The certificate file is valid" -ForegroundColor White
    exit 1
}

Write-Host "   ✓ Certificate verified successfully" -ForegroundColor Green
Write-Host ""

# Convert certificate to no password
Write-Host "2. Converting certificate to no password..." -ForegroundColor Yellow

# Create temporary files
$tempCert = [System.IO.Path]::GetTempFileName()
$tempKey = [System.IO.Path]::GetTempFileName()
$tempCertNoPass = [System.IO.Path]::GetTempFileName()

try {
    # Extract certificate and private key
    Write-Host "   Extracting certificate and private key..." -ForegroundColor Gray
    $extractCertCmd = "& `"$opensslPath`" pkcs12 -in `"$certPath`" -passin pass:`"$currentPassword`" -clcerts -nokeys -out `"$tempCert`" 2>&1"
    Invoke-Expression $extractCertCmd | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to extract certificate"
    }
    
    $extractKeyCmd = "& `"$opensslPath`" pkcs12 -in `"$certPath`" -passin pass:`"$currentPassword`" -nocerts -nodes -out `"$tempKey`" 2>&1"
    Invoke-Expression $extractKeyCmd | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to extract private key"
    }
    
    # Combine into new .p12 without password
    Write-Host "   Creating new .p12 file without password..." -ForegroundColor Gray
    $createP12Cmd = "& `"$opensslPath`" pkcs12 -export -in `"$tempCert`" -inkey `"$tempKey`" -out `"$outputPath`" -passout pass: 2>&1"
    Invoke-Expression $createP12Cmd | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create password-less certificate"
    }
    
    # Verify the new certificate
    Write-Host "   Verifying new certificate..." -ForegroundColor Gray
    $verifyNewCmd = "& `"$opensslPath`" pkcs12 -in `"$outputPath`" -passin pass: -nokeys -info -noout 2>&1"
    Invoke-Expression $verifyNewCmd | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        throw "New certificate verification failed"
    }
    
    Write-Host "   ✓ Certificate converted successfully" -ForegroundColor Green
    Write-Host ""
    
    # Encode the new certificate
    Write-Host "3. Encoding new certificate to base64..." -ForegroundColor Yellow
    $certBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($outputPath))
    $certBase64 | Set-Clipboard
    
    Write-Host "   ✓ Certificate encoded and copied to clipboard" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "=== Success ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "New certificate created: $outputPath" -ForegroundColor White
    Write-Host "Password: (none - empty string)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Update Codemagic environment variables:" -ForegroundColor White
    Write-Host "   - CERT_P12_BASE64: (base64 is in clipboard - paste it)" -ForegroundColor Gray
    Write-Host "   - P12_PASSWORD: (leave empty or delete the variable)" -ForegroundColor Gray
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
    if (Test-Path $tempCertNoPass) { Remove-Item $tempCertNoPass -Force -ErrorAction SilentlyContinue }
}




