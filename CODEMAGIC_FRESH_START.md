# Codemagic Fresh Start - Complete Reset Guide

## Goal: Start Fresh with Codemagic

We'll delete old certificates, create new ones with a simple password, and set up Codemagic from scratch.

## Step 1: Delete Old Certificates (Apple Developer Portal)

### Delete Distribution Certificate

1. Go to: https://developer.apple.com/account/resources/certificates/list
2. Sign in with your Apple Developer account
3. Find your **Apple Distribution** certificate
4. Click on it
5. Click **"Revoke"** or **"Delete"**
6. Confirm deletion

### Delete Provisioning Profile

1. Go to: https://developer.apple.com/account/resources/profiles/list
2. Find your **App Store** provisioning profile for `app.randomaita.final`
3. Click on it
4. Click **"Delete"** or **"Edit"** → **"Delete"**
5. Confirm deletion

**Note:** We'll create new ones with a simpler password.

## Step 2: Create New Certificate (Simple Password)

We'll create a new certificate with a password that has NO special characters to avoid import issues.

### New Password Recommendation

Use a simple password like:
- `RandomAITA2024` (no special characters)
- Or `AITABuild2024` (simple, easy to remember)

### Create New Certificate

1. **Generate Private Key:**
   ```bash
   openssl genrsa -out ios_distribution_new.key 2048
   ```

2. **Generate CSR:**
   ```bash
   openssl req -new -key ios_distribution_new.key -out ios_distribution_new.csr -subj "/CN=Random AITA Distribution/O=Your Name/C=US"
   ```

3. **Upload CSR to Apple:**
   - Go to: https://developer.apple.com/account/resources/certificates/add
   - Select **"Apple Distribution"**
   - Upload `ios_distribution_new.csr`
   - Download the certificate: `ios_distribution_new.cer`

4. **Create .p12 with Simple Password:**
   ```bash
   # Convert .cer to .pem
   openssl x509 -inform DER -in ios_distribution_new.cer -out ios_distribution_new.cer.pem
   
   # Create .p12 with simple password (NO special characters!)
   openssl pkcs12 -export -out ios_distribution_new.p12 -inkey ios_distribution_new.key -in ios_distribution_new.cer.pem -password pass:RandomAITA2024
   ```

5. **Verify the .p12:**
   ```bash
   openssl pkcs12 -info -in ios_distribution_new.p12 -passin pass:RandomAITA2024 -noout
   ```

## Step 3: Create New Provisioning Profile

1. Go to: https://developer.apple.com/account/resources/profiles/add
2. Select **"App Store"** distribution
3. Select your app: **"AITA Randomizer"** (Bundle ID: `app.randomaita.final`)
4. Select the **new** Apple Distribution certificate (just created)
5. Name it: **"RandomAITAFinal_AppStore_New"**
6. Download the profile: `RandomAITAFinal_AppStore_New.mobileprovision`

## Step 4: Clean Up Codemagic

### Delete Old Secrets in Codemagic

1. Go to: https://codemagic.io/apps
2. Select your app
3. Go to **"Settings"** → **"Environment variables"**
4. Delete these old secrets:
   - `IOS_DISTRIBUTION_CERT` (old)
   - `IOS_CERT_PASSWORD` (old)
   - `IOS_PROFILE_APP_STORE_BASE64` (old)
   - Any other iOS-related secrets

### Keep These Secrets (App Store Connect API)
- `ASC_KEY_P8_BASE64` (keep this)
- `ASC_KEY_ID` (keep this)
- `ASC_ISSUER_ID` (keep this)

## Step 5: Add New Secrets to Codemagic

### Encode New Certificate

```powershell
# Encode the new .p12 to base64
[Convert]::ToBase64String([IO.File]::ReadAllBytes("ios_distribution_new.p12")) | Set-Clipboard
```

### Encode New Provisioning Profile

```powershell
# Encode the new .mobileprovision to base64
[Convert]::ToBase64String([IO.File]::ReadAllBytes("RandomAITAFinal_AppStore_New.mobileprovision")) | Set-Clipboard
```

### Add to Codemagic

1. Go to Codemagic → Your App → Settings → Environment variables
2. Add these NEW secrets:

   **Secret 1: IOS_DISTRIBUTION_CERT**
   - Name: `IOS_DISTRIBUTION_CERT`
   - Value: Paste base64-encoded `.p12` (from clipboard)
   - Secure: ✅ Yes

   **Secret 2: IOS_CERT_PASSWORD**
   - Name: `IOS_CERT_PASSWORD`
   - Value: `RandomAITA2024` (or your simple password)
   - Secure: ✅ Yes

   **Secret 3: IOS_PROFILE_APP_STORE_BASE64**
   - Name: `IOS_PROFILE_APP_STORE_BASE64`
   - Value: Paste base64-encoded `.mobileprovision` (from clipboard)
   - Secure: ✅ Yes

## Step 6: Update codemagic.yaml

We'll use a clean, simple configuration.

## Step 7: Test Build

Run a test build in Codemagic to verify everything works.

## Benefits of Fresh Start

✅ **Simple Password** - No special characters = no import issues  
✅ **Clean Certificates** - No conflicts with old certificates  
✅ **Clean Secrets** - No confusion with old values  
✅ **Fresh Configuration** - Clean codemagic.yaml  

## Next Steps

1. **Delete old certificates** in Apple Developer Portal
2. **Create new certificate** with simple password
3. **Create new provisioning profile**
4. **Clean up Codemagic secrets**
5. **Add new secrets**
6. **Update codemagic.yaml**
7. **Test build**

Let me know when you're ready to start, and I'll guide you through each step!





