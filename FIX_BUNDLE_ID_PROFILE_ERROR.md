# Fix: No Matching Profiles Found for Bundle ID

## The Error

```
No matching profiles found for bundle identifier "app.randomaita.final" and distribution type "app_store"
```

This means the bundle ID either:
1. **Doesn't exist in App Store Connect** (most likely)
2. **Exists but Codemagic can't create provisioning profiles** (integration issue)

## Solution: Register Bundle ID in App Store Connect

### Step 1: Go to App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Sign in with your Apple Developer account

### Step 2: Navigate to Identifiers

1. Click on **"Users and Access"** (or go directly to https://developer.apple.com/account/resources/identifiers/list)
2. Alternatively, click **"Certificates, Identifiers & Profiles"** 
3. Click **"Identifiers"** in the left sidebar

### Step 3: Check if Bundle ID Exists

1. Search for: `app.randomaita.final`
2. If it appears in the list, skip to Step 5
3. If it doesn't exist, continue to Step 4

### Step 4: Register the Bundle ID

1. Click the **"+"** button (plus icon) in the top left
2. Select **"App IDs"** → **"App"** → Click **"Continue"**
3. Fill in the form:
   - **Description**: `Random AITA Final Version`
   - **Bundle ID**: Select **"Explicit"**
   - **Bundle ID string**: Enter `app.randomaita.final`
   - Click **"Continue"**
4. **Enable Capabilities** (check these if needed):
   - ✅ **Push Notifications** (if you want push notifications)
   - ✅ **Associated Domains** (if you need universal links)
   - ✅ **Sign in with Apple** (if you want Apple sign-in)
   - Leave others unchecked for now
5. Click **"Continue"**
6. Review the information
7. Click **"Register"**

### Step 5: Verify Bundle ID is Active

1. You should see the bundle ID in the list
2. Status should be: **"Active"**
3. Note the **Bundle ID**: `app.randomaita.final`

### Step 6: Create App in App Store Connect (If Not Done)

The bundle ID must be associated with an app in App Store Connect:

1. Go to https://appstoreconnect.apple.com
2. Click **"My Apps"**
3. Click the **"+"** button → **"New App"**
4. Fill in:
   - **Platform**: iOS
   - **Name**: `Random AITA`
   - **Primary Language**: English
   - **Bundle ID**: Select `app.randomaita.final` from the dropdown
   - **SKU**: `random-aita-final` (any unique identifier)
   - **User Access**: Full Access (if you're the only developer)
5. Click **"Create"**

### Step 7: Retry Codemagic Build

1. Go back to Codemagic
2. Start a new build
3. Codemagic should now be able to:
   - Find the bundle ID
   - Create provisioning profiles automatically
   - Build successfully

## Alternative: Check Codemagic Integration

If the bundle ID exists but you still get the error:

### Verify App Store Connect Integration

1. In Codemagic, go to **Teams** → **Integrations**
2. Find **"App Store Connect"** integration
3. Make sure:
   - Integration name is: `apple_credentials`
   - Status is: **"Active"**
   - API key has **"Admin"** or **"App Manager"** permissions

### Test API Access

The API key needs permission to:
- ✅ Create provisioning profiles
- ✅ Register bundle IDs
- ✅ Create certificates

Make sure your API key has the correct permissions.

## Quick Checklist

Before building:
- [ ] Bundle ID `app.randomaita.final` is registered in App Store Connect
- [ ] Bundle ID shows as "Active" status
- [ ] App "Random AITA" is created in App Store Connect
- [ ] App is linked to bundle ID `app.randomaita.final`
- [ ] Codemagic integration `apple_credentials` is active
- [ ] API key has "Admin" or "App Manager" role

## Troubleshooting

### "Bundle ID already exists"

If you get this error:
- The bundle ID might exist but not be linked to your account
- Try using a different bundle ID (e.g., `app.randomaita.final2`)
- Or contact Apple Developer Support

### "No App found for bundle ID"

- Make sure you created the app in App Store Connect (Step 6)
- The bundle ID must be linked to an app

### Still getting profile errors?

1. **Wait a few minutes**: It can take 5-10 minutes for Apple to process new bundle IDs
2. **Check API key permissions**: Must be "Admin" or "App Manager"
3. **Try a new build**: Codemagic caches some information, try again

## Step-by-Step Visual Guide

### Registering Bundle ID:

```
App Store Connect
  → Users and Access
    → Certificates, Identifiers & Profiles
      → Identifiers
        → + (plus button)
          → App IDs
            → App
              → Continue
                → Fill in form
                  → Register
```

### Creating App:

```
App Store Connect
  → My Apps
    → + (plus button)
      → New App
        → Fill in form
          → Create
```

## Next Steps

After registering the bundle ID:

1. Wait 5-10 minutes for Apple to process
2. Start a new build in Codemagic
3. The build should now succeed!

If you still have issues, let me know and I can help troubleshoot further.

