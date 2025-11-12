# Certificate Import Fix - Final Solution

## What Was Fixed

The `codemagic.yaml` script has been updated with a hardened certificate import process that:

1. **Omit `-P` entirely for no-password certificates** (not `-P ""`)
   - This was the main cause of "MAC verification failed" errors
   - Some macOS images reject `-P ""` but accept omitting `-P` entirely

2. **Better password normalization**
   - Strips wrapping quotes
   - Trims whitespace (leading/trailing)
   - Handles carriage returns

3. **Robust base64 decoding**
   - Works with both GNU and BSD base64
   - Strips accidental quotes from secrets
   - Validates decoded file size

4. **Comprehensive debugging**
   - Shows file size and SHA256 hash
   - Shows which import path is used (WITH password vs NO password)
   - Validates with OpenSSL before import (with `-legacy` fallback)
   - Fails early if OpenSSL check fails

5. **Explicit file type**
   - Uses `-f pkcs12` flag for clarity

## What You Need to Do

### Step 1: Verify Your Certificate

Since you have a no-password certificate, make sure:

1. **Delete `P12_PASSWORD` variable in Codemagic** (if it exists)
   - Don't just leave it empty - DELETE it completely
   - The script will show: `P12_PASSWORD var set (pre-trim): NO`

2. **Update `CERT_P12_BASE64` with the no-password certificate**
   - Run: `.\get_clean_certificate_base64.ps1`
   - This generates a clean base64 (no newlines, no quotes)
   - Copy from clipboard or from: `C:\Users\rrwil\Desktop\New API KEY\certificate_base64_clean.txt`
   - Paste into Codemagic's `CERT_P12_BASE64` variable
   - **Make sure there are NO quotes around the base64 string**

### Step 2: Verify the Base64

To verify your local certificate matches what's in Codemagic:

```powershell
# Get SHA256 of your local certificate
$certPath = "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new_nopassword.p12"
$certBytes = [IO.File]::ReadAllBytes($certPath)
$sha256 = [System.Security.Cryptography.SHA256]::Create().ComputeHash($certBytes)
$hashString = ($sha256 | ForEach-Object { $_.ToString("x2") }) -join ""
Write-Host "Local certificate SHA256: $hashString"
```

Compare this with the "P12 SHA256" shown in the build logs.

### Step 3: Commit and Push

Commit the updated `codemagic.yaml`:

```powershell
git add codemagic.yaml
git commit -m "Fix certificate import: omit -P for no-password certificates"
git push
```

### Step 4: Check Build Logs

After starting a new build, you should see:

```
=== Certificate Debug Info ===
P12 file size: 3251 bytes
P12 SHA256: [hash]
P12_PASSWORD var set (pre-trim): NO
P12_PASSWORD_CLEAN length (post-trim): 0

OpenSSL check: p12 verified with NO password.

Import path: NO password (omitting -P entirely)
✓ Certificate imported and profile installed ([UUID])
```

## What the Logs Mean

### Success Indicators

- **P12 file size: 3251 bytes** - Your certificate decoded correctly
- **P12_PASSWORD var set (pre-trim): NO** - Variable is deleted (correct for no-password)
- **P12_PASSWORD_CLEAN length (post-trim): 0** - No password after trimming
- **OpenSSL check: p12 verified with NO password** - Certificate structure is valid
- **Import path: NO password (omitting -P entirely)** - Script is using correct import method
- **✓ Certificate imported successfully** - Success!

### Failure Indicators

If you see:

- **"P12_PASSWORD var set (pre-trim): YES"** but **"P12_PASSWORD_CLEAN length: 0"**
  - The variable exists but is empty - DELETE it completely

- **"OpenSSL indicates this p12 REQUIRES a password"**
  - The certificate in `CERT_P12_BASE64` still has a password
  - Update it with the no-password certificate base64

- **"P12 SHA256" doesn't match your local file**
  - The base64 in Codemagic is for a different certificate
  - Update `CERT_P12_BASE64` with the correct base64

- **"decoded /tmp/cert.p12 is empty"**
  - The base64 is corrupted or double-encoded
  - Re-generate and paste fresh base64

## If You Want to Use a Password Instead

If you prefer to use a password-protected certificate (some macOS images work better with this):

1. Re-export your certificate with a password (e.g., "RandomAITA2024")
2. Generate base64: `.\get_clean_certificate_base64.ps1` (point it to the password-protected file)
3. In Codemagic:
   - Set `CERT_P12_BASE64` to the new base64
   - Set `P12_PASSWORD` to your password (no quotes, no spaces)
4. The logs will show:
   - `P12_PASSWORD var set (pre-trim): YES`
   - `P12_PASSWORD_CLEAN length (post-trim): [length]`
   - `OpenSSL check: p12 verified WITH password.`
   - `Import path: WITH password`

## Quick Test Commands

### Test certificate locally (no password):
```powershell
$openssl = "C:\Program Files\Git\usr\bin\openssl.exe"
& $openssl pkcs12 -in "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new_nopassword.p12" -passin pass: -nokeys -info -noout
```
Should succeed without errors.

### Verify base64 round-trip:
```powershell
$certPath = "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new_nopassword.p12"
$certBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($certPath))
$decoded = [Convert]::FromBase64String($certBase64)
$tempFile = [System.IO.Path]::GetTempFileName()
[IO.File]::WriteAllBytes($tempFile, $decoded)
$originalHash = (Get-FileHash $certPath -Algorithm SHA256).Hash
$decodedHash = (Get-FileHash $tempFile -Algorithm SHA256).Hash
if ($originalHash -eq $decodedHash) {
    Write-Host "✓ Base64 round-trip successful" -ForegroundColor Green
} else {
    Write-Host "✗ Base64 round-trip failed" -ForegroundColor Red
}
Remove-Item $tempFile
```

## Summary

The key fix: **Omit `-P` entirely for no-password certificates** instead of passing `-P ""`. This is the critical change that should resolve the "MAC verification failed" error.

The updated script now provides clear debugging output so you can see exactly what's happening and which path is being taken.


