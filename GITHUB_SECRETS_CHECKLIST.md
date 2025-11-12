# GitHub Secrets Checklist

## Error Fix: "At least one of p12-filepath or p12-file-base64 must be provided"

This error means the `IOS_DISTRIBUTION_CERT` secret is empty or missing.

## ✅ Step 1: Update IOS_DISTRIBUTION_CERT Secret

**The certificate base64 has been copied to your clipboard!**

1. Go to: https://github.com/r0bay/Latest-Version-of-AITA/settings/secrets/actions
2. Click **"New repository secret"** (or find existing `IOS_DISTRIBUTION_CERT` and click **"Update"**)
3. Name: `IOS_DISTRIBUTION_CERT`
4. Value: **Paste from clipboard (Ctrl+V)** - this is the base64-encoded `.p12` certificate
5. Click **"Add secret"** (or **"Update secret"**)

## ✅ Step 2: Verify All Required Secrets

Make sure these secrets exist in your GitHub repository:

### Certificate & Profile Secrets
- [ ] **IOS_DISTRIBUTION_CERT** - Base64-encoded `.p12` file (ready in clipboard from previous step)
- [ ] **IOS_CERT_PASSWORD** - **Password: `Quillwill7&!`** (copy this exact password)
- [ ] **IOS_APP_STORE_PROFILE** - Base64-encoded `.mobileprovision` file

### App Store Connect API Secrets
- [ ] **ASC_API_KEY** - Base64-encoded `.p8` file (from `authkey.b64` or `AuthKey_TD43RY7WKF.p8`)
- [ ] **ASC_KEY_ID** - Your API Key ID (e.g., `TD43RY7WKF`)
- [ ] **ASC_ISSUER_ID** - Your Issuer ID (e.g., `05df1fa0-6dbf-4ecd-a99a-01c92045dcd1`)

## 📋 How to Prepare Other Secrets

### IOS_APP_STORE_PROFILE
1. Download your provisioning profile from Apple Developer Portal
2. Convert to base64:
   ```powershell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("path\to\profile.mobileprovision")) | Set-Clipboard
   ```
3. Paste into GitHub secret `IOS_APP_STORE_PROFILE`

### ASC_API_KEY
If you have `authkey.b64`:
1. Open `C:\Users\rrwil\Desktop\New API KEY\authkey.b64`
2. Copy all content (should be base64-encoded `.p8` file)
3. Paste into GitHub secret `ASC_API_KEY`

Or if you have `AuthKey_TD43RY7WKF.p8`:
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\Users\rrwil\Desktop\New API KEY\AuthKey_TD43RY7WKF.p8")) | Set-Clipboard
```

### IOS_CERT_PASSWORD
- **Password: `Quillwill7&!`**
- Copy this exact password (case-sensitive, includes special characters)
- Paste into GitHub secret `IOS_CERT_PASSWORD`

## 🔍 Verify Secrets Are Set

After updating all secrets, trigger the workflow:
1. Go to: https://github.com/r0bay/Latest-Version-of-AITA/actions
2. Click **"iOS TestFlight Build"** workflow
3. Click **"Run workflow"** button (if available)
4. Or push a commit to trigger automatically

## 🐛 Troubleshooting

If you still get the error after updating `IOS_DISTRIBUTION_CERT`:

1. **Verify the secret exists:**
   - Go to repository Settings > Secrets and variables > Actions
   - Confirm `IOS_DISTRIBUTION_CERT` is listed

2. **Verify the secret value:**
   - The base64 content should be ~4464 characters long
   - Should start with `MIINEAIBAzCC...`
   - Should not have any line breaks or spaces

3. **Check the password:**
   - Verify `IOS_CERT_PASSWORD` matches the password used when creating the `.p12`
   - The password is case-sensitive

4. **Re-encode if needed:**
   ```powershell
   # Re-encode the .p12 file
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\Users\rrwil\Desktop\New API KEY\ios_distribution.p12")) | Set-Clipboard
   ```
   Then update the `IOS_DISTRIBUTION_CERT` secret with the new value.

