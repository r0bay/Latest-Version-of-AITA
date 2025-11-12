# Update Codemagic Secrets - Certificate Import Fix

## Problem
The build was failing with: `security: SecKeychainItemImport: MAC verification failed during PKCS12 import (wrong password?)`

## Solution
We've improved the certificate import step and re-encoded the certificate cleanly.

## Step 1: Get the Clean Base64 Certificate

✅ **Certificate has been re-encoded and is in your clipboard!**

The clean base64 is also saved to:
```
C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new.p12.base64.txt
```

## Step 2: Update Codemagic Environment Variables

Go to: **Codemagic → Settings → Environment Variables → `ios_signing` group**

### 1. CERT_P12_BASE64
- **Action**: Delete the old value and paste the NEW base64 from clipboard
- **Source**: The base64 is in your clipboard (from the re-encode script)
- **Important**: 
  - Copy ONLY the base64 text (no quotes, no spaces, no backticks)
  - If needed, open `ios_distribution_new.p12.base64.txt` and copy the entire contents

### 2. P12_PASSWORD
- **Value**: `RandomAITA2024`
- **Action**: Verify this is set correctly (should already be set)

### 3. MOBILEPROVISION_BASE64
- **Value**: (Should already be set from earlier)
- **Action**: Verify it's still there

### 4. PROFILE_NAME
- **Value**: `RandomAITAFinal_AppStore_New`
- **Action**: Verify this is set correctly (should already be set)

## Step 3: What Changed in the Workflow

The improved workflow now:
1. ✅ Uses `printf %s` instead of `echo` to avoid newline issues
2. ✅ Validates the password with OpenSSL BEFORE importing to keychain
3. ✅ Provides clear error messages if password is wrong or file is corrupt
4. ✅ Handles both passworded and passwordless certificates
5. ✅ Makes P12_PASSWORD optional (not required if cert has no password)

## Step 4: Verify Your Certificate Password

If you want to verify the password locally:

```bash
# In Git Bash or terminal with OpenSSL
openssl pkcs12 -info -in "C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new.p12" -passin pass:RandomAITA2024 -noout
```

If this works, you'll see certificate information. If it fails, the password is wrong.

## Step 5: Run the Build

After updating `CERT_P12_BASE64` in Codemagic:
1. Go to Codemagic → Builds
2. Click "Start new build"
3. Select your workflow
4. The certificate import should now work!

## Troubleshooting

### If it still fails with password error:

1. **Verify the password is correct:**
   ```bash
   openssl pkcs12 -info -in ios_distribution_new.p12 -passin pass:RandomAITA2024 -noout
   ```

2. **Check the base64 encoding:**
   - Open `ios_distribution_new.p12.base64.txt`
   - Make sure there are NO spaces, quotes, or line breaks
   - Copy the entire contents as one continuous string

3. **Re-export the certificate (if needed):**
   - If you're on a Mac: Keychain Access → Certificates → Right-click → Export → .p12
   - Set password to `RandomAITA2024` (simple, no special chars)
   - Re-run the re-encode script

### If it fails with "file is corrupt":

1. The base64 might have been corrupted during copy/paste
2. Re-run the re-encode script: `powershell -ExecutionPolicy Bypass -File "re_encode_certificate.ps1"`
3. Copy the NEW base64 from clipboard or file
4. Update `CERT_P12_BASE64` in Codemagic

## Summary

✅ Certificate re-encoded cleanly  
✅ Workflow improved with password validation  
✅ Changes committed and pushed to `main`  
✅ Base64 is in your clipboard - ready to paste into Codemagic  

**Next**: Update `CERT_P12_BASE64` in Codemagic with the new value from your clipboard!





