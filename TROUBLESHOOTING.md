# TROUBLESHOOTING: Codemagic Code Signing Issues

## The Problem
Codemagic can't create distribution certificates, causing export to fail.

## Critical Check: Is the App Registered in App Store Connect?

**Before Codemagic can create certificates, you MUST:**

1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: (your app name, e.g., "Random AITA")
   - Primary Language: English
   - Bundle ID: **com.randomaita.app** (must match exactly)
   - SKU: (any unique identifier, e.g., "random-aita-001")
4. Click "Create"

**This step is REQUIRED** - Codemagic cannot create certificates for a bundle ID that doesn't exist in App Store Connect.

## Verify App Store Connect API Integration

1. Go to Codemagic → Teams → Integrations
2. Find "App Store Connect" integration
3. Verify:
   - Status shows "Connected" or "Active"
   - Key ID matches your API key
   - Issuer ID is set
   - .p8 file is uploaded
   - Name matches `apple_credentials` (or update YAML to match)

## Check API Key Permissions

The API key must be created by a user with:
- "App Manager" or "Admin" role
- Access to Certificates, Identifiers & Profiles

To check:
1. App Store Connect → Users and Access → Keys
2. Find your API key
3. Check who created it
4. Verify that user has "App Manager" or "Admin" role

## Next Steps

1. **FIRST**: Create the app in App Store Connect (if not done)
2. **THEN**: Run another build
3. **CHECK**: The "Set up code signing" step output to see if certificates are created

If the app is created but certificates still fail, share the "Set up code signing" step output.

