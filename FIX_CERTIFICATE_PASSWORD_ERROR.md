# Fix: MAC verification failed during PKCS12 import

## Error
```
security: SecKeychainItemImport: MAC verification failed during PKCS12 import (wrong password?)
Error: The process '/usr/bin/security' failed with exit code 1
```

## Root Cause
This error occurs when:
1. The password is incorrect
2. The base64-encoded certificate is corrupted (has line breaks, spaces, or encoding issues)
3. Special characters in the password are not handled correctly

## Solution

### Step 1: Update Certificate Base64 (DONE)
✅ A clean base64-encoded certificate has been generated and copied to your clipboard.

**Action Required:**
1. Go to: https://github.com/r0bay/Latest-Version-of-AITA/settings/secrets/actions
2. Find secret: `IOS_DISTRIBUTION_CERT`
3. Click the edit (pencil) icon
4. **Delete all existing content**
5. Paste the new base64 string from clipboard (Ctrl+V)
6. **Verify it's a single continuous line with NO line breaks or spaces**
7. Click "Update secret"

### Step 2: Verify Password
The password is: `Quillwill7&!`

**Special Characters:**
- `&` (ampersand)
- `!` (exclamation mark)

**Action Required:**
1. Go to: https://github.com/rrwil/Desktop/AITA Project - Copy/settings/secrets/actions
2. Find secret: `IOS_CERT_PASSWORD`
3. Click the edit (pencil) icon
4. **Verify the password is exactly:** `Quillwill7&!`
5. Make sure there are NO:
   - Leading or trailing spaces
   - Hidden characters
   - Line breaks
6. If needed, delete and re-enter the password
7. Click "Update secret"

### Step 3: Verify Certificate File
The certificate file has been verified locally:
- ✅ Password `Quillwill7&!` works locally
- ✅ Certificate file is valid
- ✅ Base64 encoding is correct (4464 characters)

## Verification Steps

After updating the secrets:

1. **Check the workflow file** - Make sure it references the correct secrets:
   - `IOS_DISTRIBUTION_CERT` ✅
   - `IOS_CERT_PASSWORD` ✅

2. **Trigger a new workflow run:**
   - Go to: https://github.com/r0bay/Latest-Version-of-AITA/actions
   - Click "iOS TestFlight Build"
   - Click "Run workflow" (or push a commit)

3. **Monitor the build logs:**
   - The "Install Apple Certificate" step should succeed
   - You should see: "Certificate imported successfully"

## Troubleshooting

If the error persists:

### Option 1: Re-encode the certificate
The certificate has been re-encoded and saved to:
`C:\Users\rrwil\Desktop\New API KEY\ios_distribution_fixed.b64`

This file contains a clean base64 string with no line breaks.

### Option 2: Verify password encoding
The password `Quillwill7&!` contains special characters. Make sure:
- No URL encoding is applied
- No HTML entity encoding is applied
- The password is stored as plain text in GitHub secrets

### Option 3: Check for hidden characters
Sometimes copying/pasting can introduce hidden characters:
- Copy the password fresh: `Quillwill7&!`
- Paste it into a text editor first
- Verify it looks correct
- Then paste into GitHub secret

## Expected Result

After updating both secrets:
- ✅ Certificate import should succeed
- ✅ Workflow should proceed to build step
- ✅ No "MAC verification failed" error

## Files Generated

1. `ios_distribution_fixed.b64` - Clean base64-encoded certificate (4464 characters)
2. This file is in your clipboard and ready to paste into GitHub





