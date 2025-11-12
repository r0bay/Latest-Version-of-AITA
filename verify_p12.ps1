# Verify P12 Certificate Password Locally
# Run this if the workflow fails with certificate errors

param(
    [string]$P12Path = "",
    [string]$Password = "Quillwill7&!"
)

if ([string]::IsNullOrEmpty($P12Path)) {
    Write-Host "Usage: .\verify_p12.ps1 -P12Path 'C:\path\to\ios_distribution.p12' [-Password 'password']" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Example:" -ForegroundColor Cyan
    Write-Host '  .\verify_p12.ps1 -P12Path "C:\Users\rrwil\Desktop\ios_distribution.p12"' -ForegroundColor Cyan
    exit 1
}

if (-not (Test-Path $P12Path)) {
    Write-Host "ERROR: P12 file not found at: $P12Path" -ForegroundColor Red
    exit 1
}

Write-Host "Verifying P12 certificate..." -ForegroundColor Green
Write-Host "File: $P12Path" -ForegroundColor Cyan
Write-Host ""

# Use certutil to verify the password
$result = certutil -p $Password -dump $P12Path 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ P12 certificate password is CORRECT" -ForegroundColor Green
    Write-Host ""
    Write-Host "Certificate details:" -ForegroundColor Cyan
    $result | Select-String -Pattern "Subject|Issuer|Serial|NotBefore|NotAfter" | ForEach-Object { Write-Host $_.Line }
} else {
    Write-Host "✗ P12 certificate password is INCORRECT or file is corrupt" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error output:" -ForegroundColor Yellow
    $result | ForEach-Object { Write-Host $_ }
    Write-Host ""
    Write-Host "If password is correct, the file might be corrupt." -ForegroundColor Yellow
    Write-Host "Re-export the certificate from Keychain Access." -ForegroundColor Yellow
    exit 1
}

