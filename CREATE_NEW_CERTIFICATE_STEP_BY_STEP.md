# Create New Certificate - Step by Step

## Bundle ID: `app.randomaita.final`
## Password: `RandomAITA2024` (simple, no special characters)

## Step 1: Generate Private Key

Open **Git Bash** or **OpenSSL Command Prompt** and run:

```bash
# Navigate to your certificate folder
cd "C:\Users\rrwil\Desktop\New API KEY"

# Generate private key
openssl genrsa -out ios_distribution_new.key 2048
```

## Step 2: Generate Certificate Signing Request (CSR)

```bash
# Generate CSR
openssl req -new -key ios_distribution_new.key -out ios_distribution_new.csr \
  -subj "/CN=Random AITA Distribution/O=Your Name/C=US"
```

**Note:** Replace "Your Name" with your actual name or company name.

## Step 3: Upload CSR to Apple Developer Portal

1. Go to: https://developer.apple.com/account/resources/certificates/add
2. Click **"+"** button (or "Create a new certificate")
3. Select **"Apple Distribution"**
4. Click **"Continue"**
5. Click **"Choose File"**
6. Select: `ios_distribution_new.csr`
7. Click **"Continue"**
8. Click **"Download"**
9. Save the file as: `ios_distribution_new.cer`

## Step 4: Convert Certificate to PEM Format

```bash
# Convert .cer to .pem
openssl x509 -inform DER -in ios_distribution_new.cer -out ios_distribution_new.cer.pem
```

## Step 5: Create .p12 Certificate with Simple Password

```bash
# Create .p12 with SIMPLE password (NO special characters!)
openssl pkcs12 -export \
  -out ios_distribution_new.p12 \
  -inkey ios_distribution_new.key \
  -in ios_distribution_new.cer.pem \
  -password pass:RandomAITA2024
```

**Important:** The password is `RandomAITA2024` - no special characters!

## Step 6: Verify the Certificate

```bash
# Verify the .p12 works with the password
openssl pkcs12 -info -in ios_distribution_new.p12 -passin pass:RandomAITA2024 -noout
```

If this works, you'll see certificate information. If it fails, check the password.

## Step 7: Create Provisioning Profile

1. Go to: https://developer.apple.com/account/resources/profiles/add
2. Select **"App Store"** (under Distribution)
3. Click **"Continue"**
4. Select your app: **"Random AITA Final Version"** (Bundle ID: `app.randomaita.final`)
5. Click **"Continue"**
6. Select the **new** Apple Distribution certificate (just created)
7. Click **"Continue"**
8. Enter Profile Name: **"RandomAITAFinal_AppStore_New"**
9. Click **"Generate"**
10. Click **"Download"**
11. Save as: `RandomAITAFinal_AppStore_New.mobileprovision`

## Step 8: Encode for Codemagic

### Encode Certificate (.p12)

In **PowerShell**:

```powershell
# Encode certificate to base64
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\Users\rrwil\Desktop\New API KEY\ios_distribution_new.p12")) | Set-Clipboard
```

### Encode Provisioning Profile (.mobileprovision)

In **PowerShell**:

```powershell
# Encode profile to base64
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\Users\rrwil\Desktop\New API KEY\RandomAITAFinal_AppStore_New.mobileprovision")) | Set-Clipboard
```

## Step 9: Add to Codemagic

1. Go to: https://codemagic.io/apps
2. Select your app
3. **Settings** → **Environment variables**
4. Add these secrets:

   **Secret 1: IOS_DISTRIBUTION_CERT**
   - Name: `IOS_DISTRIBUTION_CERT`
   - Value: Paste base64 from clipboard (certificate)
   - Secure: ✅ Yes

   **Secret 2: IOS_CERT_PASSWORD**
   - Name: `IOS_CERT_PASSWORD`
   - Value: `RandomAITA2024`
   - Secure: ✅ Yes

   **Secret 3: IOS_PROFILE_APP_STORE_BASE64**
   - Name: `IOS_PROFILE_APP_STORE_BASE64`
   - Value: Paste base64 from clipboard (profile)
   - Secure: ✅ Yes

## Step 10: Update codemagic.yaml

Replace your current `codemagic.yaml` with the clean version, or I can update it for you.

## Troubleshooting

### Certificate Import Fails

1. **Verify password:**
   ```bash
   openssl pkcs12 -info -in ios_distribution_new.p12 -passin pass:RandomAITA2024 -noout
   ```

2. **Check file size:**
   - Certificate should be ~3-5 KB
   - If smaller, the encoding might be wrong

3. **Verify base64:**
   - Should be one continuous string
   - No line breaks or spaces

### Provisioning Profile Issues

1. **Verify bundle ID matches:**
   ```bash
   security cms -D -i RandomAITAFinal_AppStore_New.mobileprovision | grep -i "app.randomaita.final"
   ```

2. **Check profile type:**
   - Should be "App Store" distribution
   - Not "Development" or "Ad Hoc"

## Summary

✅ **Bundle ID**: `app.randomaita.final`  
✅ **Password**: `RandomAITA2024` (simple, no special chars)  
✅ **Certificate Type**: Apple Distribution  
✅ **Profile Type**: App Store  
✅ **Profile Name**: `RandomAITAFinal_AppStore_New`  

You're ready to create the certificate! Let me know if you need help with any step.





