# Codemagic: Developer Portal = App Store Connect Integration

## Where to Find It

In Codemagic, the **App Store Connect integration** is called **"Developer Portal"**.

## Current Status (From Your Screenshot)

Looking at your Integrations page:
- ✅ **Developer Portal** - Connected (green dot)
- Status: "Apple Developer Portal integration for automatic code signing has been connected using 1 key"
- Button: **"Manage keys"**

This is good! The integration is already connected.

## What to Check

### Step 1: Verify the Integration

1. On the Integrations page, find **"Developer Portal"**
2. Click **"Manage keys"** button
3. You should see:
   - **Key ID**: Should be displayed
   - **Issuer ID**: Should be displayed
   - **Status**: Active/Connected
   - Option to add/remove keys

### Step 2: Verify Integration Name

The integration needs to match what's in your `codemagic.yaml`. However, with the new `ios_signing` configuration, Codemagic should automatically use the Developer Portal integration.

Let me check your configuration:

```yaml
environment:
  ios_signing:
    distribution_type: app_store
    bundle_identifier: app.randomaita.final
```

This should automatically use the Developer Portal integration!

### Step 3: Check API Key Permissions

When you click "Manage keys", verify:
- The API key has **"Admin"** role (or "App Manager" with full permissions)
- The key is **active** (not expired or revoked)

## If Integration Isn't Working

### Option 1: Reconfigure the Integration

1. Click **"Manage keys"** on Developer Portal
2. You can:
   - Add a new key
   - Update existing key
   - Verify the key details

### Option 2: Add a New Key

If the current key doesn't have the right permissions:

1. **Create a new API key in App Store Connect:**
   - Go to https://appstoreconnect.apple.com/access/api
   - Create a new key with **"Admin"** role
   - Download the `.p8` file
   - Note Key ID and Issuer ID

2. **Add it to Codemagic:**
   - Click **"Manage keys"** on Developer Portal
   - Click **"Add key"** or similar
   - Enter:
     - Key ID
     - Issuer ID
     - Upload `.p8` file

## Using the Integration

With your current `codemagic.yaml` configuration:

```yaml
environment:
  ios_signing:
    distribution_type: app_store
    bundle_identifier: app.randomaita.final
```

Codemagic will automatically:
- Use the Developer Portal integration
- Create certificates
- Create provisioning profiles
- Sign your app

You **don't need** to specify the integration name explicitly with `ios_signing` - it uses the Developer Portal automatically.

## Troubleshooting

### Build Still Fails with Code Signing Errors

If builds still fail even though Developer Portal is connected:

1. **Check API Key Permissions:**
   - Click "Manage keys"
   - Verify the key has "Admin" role
   - Check if key is active

2. **Verify Bundle ID:**
   - Bundle ID `app.randomaita.final` must exist in App Store Connect
   - App must be created in App Store Connect
   - Bundle ID must be linked to the app

3. **Check Build Logs:**
   - Look for specific error messages
   - Common errors:
     - "No matching profiles" - Bundle ID or app not created
     - "No Accounts" - API key permissions issue
     - "Invalid credentials" - API key expired/revoked

### Integration Not Visible

If you don't see "Developer Portal":
1. Make sure you're in the correct team in Codemagic
2. Check you have the right permissions
3. Try refreshing the page

## Summary

✅ **Developer Portal** = App Store Connect integration  
✅ Already connected (green dot in your screenshot)  
✅ Your `codemagic.yaml` is configured correctly with `ios_signing`  
✅ Codemagic should automatically use this integration

**Next step:** If builds are still failing, click "Manage keys" to verify the API key has the correct permissions and is active.

