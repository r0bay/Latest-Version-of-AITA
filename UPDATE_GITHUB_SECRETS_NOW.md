# Update GitHub Secrets - Quick Guide

## ✅ Immediate Actions Required

### 1. Update IOS_DISTRIBUTION_CERT
- **Status**: Base64 content is in your clipboard (from previous step)
- **Action**: 
  1. Go to: https://github.com/r0bay/Latest-Version-of-AITA/settings/secrets/actions
  2. Find or create secret: `IOS_DISTRIBUTION_CERT`
  3. Paste the clipboard content (Ctrl+V)
  4. Click "Update secret" or "Add secret"

### 2. Update IOS_CERT_PASSWORD
- **Password**: `Quillwill7&!`
- **Action**:
  1. Go to: https://github.com/r0bay/Latest-Version-of-AITA/settings/secrets/actions
  2. Find or create secret: `IOS_CERT_PASSWORD`
  3. Paste: `Quillwill7&!`
  4. Click "Update secret" or "Add secret"

### 3. Verify Other Secrets Exist
Make sure these secrets are also set:
- `IOS_APP_STORE_PROFILE` (base64-encoded `.mobileprovision` file)
- `ASC_API_KEY` (base64-encoded `.p8` file)
- `ASC_KEY_ID` (e.g., `TD43RY7WKF`)
- `ASC_ISSUER_ID` (your Issuer ID)

## 🎯 After Updating Secrets

1. Go to: https://github.com/r0bay/Latest-Version-of-AITA/actions
2. Click on "iOS TestFlight Build" workflow
3. Click "Run workflow" button (if available)
4. Or push a commit to trigger the workflow automatically

## ✅ Expected Result

After updating `IOS_DISTRIBUTION_CERT` and `IOS_CERT_PASSWORD`, the workflow should:
- ✅ Successfully import the certificate
- ✅ Proceed to build the iOS app
- ✅ Upload to TestFlight

The error "At least one of p12-filepath or p12-file-base64 must be provided" should be resolved.

## 📝 Password Details

- **Password**: `Quillwill7&!`
- **Case-sensitive**: Yes
- **Special characters**: `&` and `!`
- **Used for**: Decrypting the `ios_distribution.p12` certificate file





