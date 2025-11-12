# Codemagic Clean Setup - Step by Step

## Overview: Start Fresh with Simple Password

We'll delete old certificates, create new ones with a **simple password (no special characters)**, and set up Codemagic with manual certificate import.

## Step 1: Delete Old Certificates

### In Apple Developer Portal

1. **Delete Distribution Certificate:**
   - Go to: https://developer.apple.com/account/resources/certificates/list
   - Find **"Apple Distribution"** certificate
   - Click **"Revoke"** or **"Delete"**
   - Confirm

2. **Delete Provisioning Profile:**
   - Go to: https://developer.apple.com/account/resources/profiles/list
   - Find **"App Store"** profile for `app.randomaita.final`
   - Click **"Delete"**
   - Confirm

## Step 2: Create New Certificate (Simple Password)

### Use Simple Password: `RandomAITA2024`

**No special characters** = No import issues!

### Commands (Run in Git Bash or OpenSSL Command Prompt)

```bash
# 1. Generate private key
openssl genrsa -out ios_distribution_new.key 2048

# 2. Generate CSR
openssl req -new -key ios_distribution_new.key -out ios_distribution_new.csr \
  -subj "/CN=Random AITA Distribution/O=Your Name/C=US"

# 3. Upload ios_distribution_new.csr to Apple Developer Portal
#    Go to: https://developer.apple.com/account/resources/certificates/add
#    Select "Apple Distribution"
#    Upload the CSR
#    Download the certificate: ios_distribution_new.cer

# 4. Convert .cer to .pem
openssl x509 -inform DER -in ios_distribution_new.cer -out ios_distribution_new.cer.pem

# 5. Create .p12 with SIMPLE password (NO special characters!)
openssl pkcs12 -export \
  -out ios_distribution_new.p12 \
  -inkey ios_distribution_new.key \
  -in ios_distribution_new.cer.pem \
  -password pass:RandomAITA2024

# 6. Verify the .p12 works
openssl pkcs12 -info -in ios_distribution_new.p12 -passin pass:RandomAITA2024 -noout
```

## Step 3: Create New Provisioning Profile

1. Go to: https://developer.apple.com/account/resources/profiles/add
2. Select **"App Store"**
3. Select app: **"AITA Randomizer"** (Bundle ID: `app.randomaita.final`)
4. Select the **new** Apple Distribution certificate
5. Name: **"RandomAITAFinal_AppStore_New"**
6. Download: `RandomAITAFinal_AppStore_New.mobileprovision`

## Step 4: Clean Up Codemagic Secrets

1. Go to: https://codemagic.io/apps
2. Select your app
3. **Settings** → **Environment variables**
4. **Delete these old secrets:**
   - `IOS_DISTRIBUTION_CERT` (old)
   - `IOS_CERT_PASSWORD` (old)
   - `IOS_PROFILE_APP_STORE_BASE64` (old)

5. **Keep these (App Store Connect API):**
   - `apple_credentials` group (keep)
   - Or individual: `ASC_KEY_P8_BASE64`, `ASC_KEY_ID`, `ASC_ISSUER_ID`

## Step 5: Encode and Add New Secrets

### Encode New Certificate

```powershell
# In PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("ios_distribution_new.p12")) | Set-Clipboard
```

### Encode New Provisioning Profile

```powershell
# In PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("RandomAITAFinal_AppStore_New.mobileprovision")) | Set-Clipboard
```

### Add to Codemagic

1. Go to Codemagic → Your App → **Settings** → **Environment variables**
2. Click **"Add variable"**

   **Secret 1: IOS_DISTRIBUTION_CERT**
   - Name: `IOS_DISTRIBUTION_CERT`
   - Value: Paste base64 from clipboard
   - Secure: ✅ Yes
   - Group: (optional, or leave default)

   **Secret 2: IOS_CERT_PASSWORD**
   - Name: `IOS_CERT_PASSWORD`
   - Value: `RandomAITA2024`
   - Secure: ✅ Yes

   **Secret 3: IOS_PROFILE_APP_STORE_BASE64**
   - Name: `IOS_PROFILE_APP_STORE_BASE64`
   - Value: Paste base64 from clipboard
   - Secure: ✅ Yes

## Step 6: Update codemagic.yaml

Replace your current `codemagic.yaml` with the clean version I created: `codemagic.yaml.clean`

Or I can update it for you - just let me know!

## Step 7: Test Build

1. Go to Codemagic
2. Click **"Start new build"**
3. Select **"iOS Workflow - Clean Start"**
4. Monitor the build

## Benefits of This Approach

✅ **Simple Password** - No special characters = no import issues  
✅ **Manual Import** - More control, better error messages  
✅ **Clean Start** - No conflicts with old certificates  
✅ **Clear Steps** - Easy to troubleshoot  

## Troubleshooting

### If Certificate Import Fails

1. **Verify password:**
   ```bash
   openssl pkcs12 -info -in ios_distribution_new.p12 -passin pass:RandomAITA2024 -noout
   ```

2. **Check base64 encoding:**
   - Make sure no line breaks
   - Should be one continuous string

3. **Verify certificate size:**
   - Should be ~3-5 KB when decoded

### If Provisioning Profile Fails

1. **Verify profile matches bundle ID:**
   ```bash
   security cms -D -i RandomAITAFinal_AppStore_New.mobileprovision | grep -i "app.randomaita.final"
   ```

2. **Check profile type:**
   - Should be "App Store" distribution

## Next Steps

1. **Delete old certificates** in Apple Developer Portal
2. **Create new certificate** with simple password
3. **Create new provisioning profile**
4. **Clean up Codemagic secrets**
5. **Add new secrets**
6. **Update codemagic.yaml**
7. **Test build**

Let me know when you're ready to start, and I'll guide you through each step!





