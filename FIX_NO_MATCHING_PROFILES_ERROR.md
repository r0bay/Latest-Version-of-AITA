# Fix: "No matching profiles found" Error in Codemagic

## The Error

```
No matching profiles found for bundle identifier "app.randomaita.final" and distribution type "app_store"
```

This means Codemagic can't find or create a provisioning profile for your bundle ID.

## Root Causes

1. **App doesn't exist in App Store Connect** (even though bundle ID exists)
2. **App exists but isn't linked to the bundle ID correctly**
3. **Codemagic can't create profiles automatically** (API permissions issue)
4. **Timing issue** - Apple hasn't processed the app yet

## Step-by-Step Fix

### Step 1: Verify App Exists in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click **"My Apps"**
3. Look for **"AITA Randomizer"** (or whatever you named it)
4. **Click on it** to open the app details

### Step 2: Verify Bundle ID is Linked

1. In the app details page, click **"App Information"** (left sidebar)
2. Scroll down to **"General Information"**
3. Check **"Bundle ID"** - it should show: `app.randomaita.final`
4. **If it shows a different bundle ID** or is blank:
   - This is the problem! The app isn't linked to the correct bundle ID
   - You may need to create a new app with the correct bundle ID

### Step 3: Verify Bundle ID Type

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Find `app.randomaita.final`
3. Click on it
4. Verify:
   - **Type**: Should be **"App ID"** (not "Explicit App ID" or something else)
   - **Status**: Should be **"Active"**
   - **Capabilities**: Should match what your app needs

### Step 4: Wait for Apple to Process

After creating/changing the app or bundle ID:
- Wait **10-15 minutes** for Apple to fully process it
- Then try the build again

### Step 5: Check API Key Permissions

1. Go to Codemagic → Teams → Integrations
2. Click **"Manage keys"** on Developer Portal
3. Verify:
   - Key ID: `5DY2K29Z5XXJ`
   - Role: **"Admin"** (must be Admin, not just App Manager)
   - Status: **Active**

If the key doesn't have Admin role, you need to create a new key.

## Alternative: Manual Provisioning Profile (Workaround)

If automatic signing still doesn't work, you can create a provisioning profile manually:

### Option 1: Create Profile via App Store Connect

1. Go to https://developer.apple.com/account/resources/profiles/list
2. Click **"+"** button
3. Select **"App Store"** under Distribution
4. Select your App ID: `app.randomaita.final`
5. Select your distribution certificate
6. Name it: `Random AITA App Store`
7. Click **"Generate"**
8. Download the profile (but you don't need to upload it - Codemagic should find it)

### Option 2: Let Xcode Create It

Actually, with `-allowProvisioningUpdates`, Xcode should create the profile automatically during build. The issue might be that Codemagic's `ios_signing` isn't triggering properly.

## Fix: Update Codemagic Configuration

Let's try a different approach. The issue might be that `ios_signing` needs the app to be explicitly referenced. Let me update the configuration:

```yaml
environment:
  ios_signing:
    distribution_type: app_store
    bundle_identifier: app.randomaita.final
    # Try adding explicit app reference
    # Note: This might not be necessary, but let's verify the setup
```

Actually, the configuration looks correct. The real issue is likely one of:
1. App not created/linked correctly
2. API key permissions
3. Timing issue

## Quick Checklist

Before building:
- [ ] App "AITA Randomizer" exists in App Store Connect
- [ ] App is linked to bundle ID `app.randomaita.final`
- [ ] Bundle ID `app.randomaita.final` exists in Apple Developer Portal
- [ ] Bundle ID status is "Active"
- [ ] API key has "Admin" role (not just App Manager)
- [ ] Waited 10-15 minutes after creating/linking app

## Most Likely Issue

Based on the error, the **most likely issue** is:

**The app in App Store Connect isn't properly linked to bundle ID `app.randomaita.final`**

### To Fix This:

1. Go to App Store Connect → My Apps → AITA Randomizer
2. Click "App Information"
3. Check the Bundle ID
4. If it's wrong or missing:
   - You might need to **create a new app** with the correct bundle ID
   - Or update the existing app (if possible)
   - Note: Bundle ID can't be changed after app creation

## Next Steps

1. **Verify app exists and is linked correctly** (Step 1-2 above)
2. **Check API key has Admin role** (Step 5 above)
3. **Wait 10-15 minutes** if you just created/updated the app
4. **Try building again**

If it still fails, share:
- What Bundle ID shows in App Store Connect (for the app)
- What role your API key has
- Any other error messages from the build log

