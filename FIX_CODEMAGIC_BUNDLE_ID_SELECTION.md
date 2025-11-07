# Fix: Codemagic Can't Select Bundle ID for Build

## The Problem

Your bundle ID `app.randomaita.final` exists in Apple Developer Portal, but Codemagic can't select it or create provisioning profiles for it.

This usually means:
1. **The app isn't created in App Store Connect** (most common)
2. **Codemagic can't create provisioning profiles automatically** (API permissions issue)
3. **The bundle ID isn't properly linked to an app**

## Solution: Create App in App Store Connect

### Step 1: Go to App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Sign in with your Apple Developer account

### Step 2: Check if App Exists

1. Click **"My Apps"** in the top navigation
2. Look for an app named **"Random AITA"**
3. If it exists, check if it's linked to bundle ID `app.randomaita.final`
4. If it doesn't exist, continue to Step 3

### Step 3: Create New App

1. Click the **"+"** button (top left) → **"New App"**
2. Fill in the form:
   - **Platform**: Select **"iOS"**
   - **Name**: `Random AITA`
   - **Primary Language**: English (or your preference)
   - **Bundle ID**: Click the dropdown and select **`app.randomaita.final`**
     - ⚠️ **Important:** If `app.randomaita.final` doesn't appear in the dropdown, it means the bundle ID exists but isn't properly registered for app distribution. See troubleshooting below.
   - **SKU**: `random-aita-final-2025` (any unique identifier - this can be anything)
   - **User Access**: Select **"Full Access"** (if you're the only developer)
3. Click **"Create"**

### Step 4: Verify App is Created

1. You should see the app "Random AITA" in your My Apps list
2. Click on it
3. Check that the Bundle ID shows: `app.randomaita.final`
4. The app status should be: **"Prepare for Submission"**

### Step 5: Wait and Retry Build

1. **Wait 5-10 minutes** for Apple to process the app creation
2. Go back to Codemagic
3. Start a new build
4. Codemagic should now be able to:
   - Find the bundle ID
   - Create App Store distribution provisioning profiles
   - Build successfully

## Alternative: Check Codemagic Integration

If the app exists but Codemagic still can't build:

### Verify App Store Connect API Integration

1. In Codemagic, go to **Teams** → **Integrations**
2. Find **"App Store Connect"** integration
3. Make sure:
   - Integration name is: `apple_credentials` (must match exactly)
   - Status is: **"Active"** or shows a green checkmark
   - API key has **"Admin"** role (or "App Manager" with full permissions)

### Test API Permissions

The API key needs these permissions:
- ✅ Read and write access to apps
- ✅ Read and write access to provisioning profiles
- ✅ Read and write access to certificates

### Regenerate API Key (If Needed)

If the API key doesn't have the right permissions:

1. Go to https://appstoreconnect.apple.com/access/api
2. Create a **new** API key with **"Admin"** role
3. Download the new `.p8` file
4. Update the integration in Codemagic with the new key

## Troubleshooting

### Bundle ID Doesn't Appear in App Store Connect Dropdown

If `app.randomaita.final` doesn't show up when creating the app:

1. **Check Bundle ID Status:**
   - Go to https://developer.apple.com/account/resources/identifiers/list
   - Find `app.randomaita.final`
   - Click on it
   - Make sure it's an **"App ID"** (not a different type)
   - Status should be **"Active"**

2. **Verify Bundle ID Type:**
   - In the identifier details, check the type
   - It should say **"App"** under **"Type"**
   - If it's not an App ID, you may need to create a new one

3. **Wait and Refresh:**
   - Sometimes it takes a few minutes for new bundle IDs to appear
   - Try refreshing the App Store Connect page
   - Or wait 10-15 minutes and try again

### Codemagic Still Can't Build After Creating App

1. **Check Build Logs:**
   - Look for specific error messages
   - The error might give clues about what's missing

2. **Verify Team ID:**
   - In Codemagic, make sure `TEAM_ID: US86BZ3GH5` matches your developer account
   - This should match the Team ID shown in Apple Developer Portal

3. **Check Bundle ID in Codemagic Config:**
   - In `codemagic.yaml`, verify:
     ```yaml
     bundle_identifier: app.randomaita.final
     BUNDLE_ID: app.randomaita.final
     ```
   - Make sure there are no extra spaces or typos

4. **Try Manual Profile Creation (Last Resort):**
   - Go to Apple Developer Portal → Profiles
   - Create a distribution provisioning profile manually
   - But this defeats the purpose of automatic signing - only do this if automatic doesn't work

## Quick Checklist

Before building in Codemagic:
- [ ] Bundle ID `app.randomaita.final` exists in Apple Developer Portal
- [ ] App "Random AITA" is created in App Store Connect
- [ ] App is linked to bundle ID `app.randomaita.final`
- [ ] Codemagic integration `apple_credentials` is active
- [ ] API key has "Admin" role
- [ ] Waited 5-10 minutes after creating the app
- [ ] Team ID in Codemagic matches your developer account: `US86BZ3GH5`

## Step-by-Step Visual Guide

### Creating App in App Store Connect:

```
App Store Connect
  → My Apps
    → + (plus button)
      → New App
        → Platform: iOS
        → Name: Random AITA
        → Bundle ID: [Select app.randomaita.final from dropdown]
        → SKU: random-aita-final-2025
        → Create
```

### Verifying App:

```
App Store Connect
  → My Apps
    → Random AITA
      → App Information
        → Bundle ID: Should show app.randomaita.final
```

## Next Steps

After creating the app in App Store Connect:

1. Wait 5-10 minutes for processing
2. Go to Codemagic
3. Start a new build
4. The build should now succeed!

If you still have issues, share the specific error message from Codemagic and I can help troubleshoot further.

