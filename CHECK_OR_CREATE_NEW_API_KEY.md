# Check or Create New API Key - Step by Step

## Step 1: Check Your Existing Key First

**You DON'T need a new key if your existing one has the right permissions!**

1. Go to https://appstoreconnect.apple.com/access/api
2. Click **"Keys"** tab
3. Find your key with Key ID: **`5DY2K29Z5XXJ`**
4. Click on it to see details

## Step 2: Check the Permissions

Look for these settings:

- **Role**: Should be "Admin", "App Manager", or "Developer"
- **Access to Certificates, Identifiers & Profiles**: Should be **ENABLED** ✅

## Step 3: Decision Time

### ✅ If "Access to Certificates, Identifiers & Profiles" is ENABLED:

**Good news!** You DON'T need a new key. The issue is something else.

**Next steps:**
- Check the build logs for the actual error
- The diagnostic step should help identify the problem
- It might be a timing issue (wait and retry)

### ❌ If "Access to Certificates, Identifiers & Profiles" is NOT ENABLED:

**You need to create a new key** because:
- Old keys can't have permissions added
- Only new keys can have profile access enabled

## Step 4: Create New Key (Only If Needed)

**ONLY do this if your existing key doesn't have profile access!**

### 4a: Create New Key in App Store Connect

1. Go to https://appstoreconnect.apple.com/access/api
2. Click **"Keys"** tab
3. Click **"+"** button (plus icon, top left)
4. Fill in:
   - **Name**: `Codemagic CI/CD` (or any name you like)
   - **Role**: Select **"Admin"** (recommended)
   - **Access to Certificates, Identifiers & Profiles**: **CHECK THIS BOX** ✅
5. Click **"Generate"**
6. **IMPORTANT:** Download the `.p8` file immediately (you can only download once!)
7. Note down:
   - **Key ID** (e.g., `ABC123DEF4`)
   - **Issuer ID** (shown at the top of the page)

### 4b: Update Codemagic Integration

1. Go to Codemagic → Teams → Integrations
2. Find **"Developer Portal"**
3. Click **"Manage keys"**
4. Click **"Add key"** or **"Update"** (depending on interface)
5. Fill in:
   - **Key ID**: The new Key ID from Step 4a
   - **Issuer ID**: The Issuer ID from Step 4a
   - **Private key (.p8)**: Upload the `.p8` file you downloaded
6. Click **"Save"**

### 4c: Verify New Key is Active

1. In Codemagic, go back to Teams → Integrations
2. Click "Manage keys" on Developer Portal
3. You should see both keys (old and new)
4. The new key should show as "Active"

## Quick Decision Tree

```
Do you have an API key?
├─ YES → Check if it has "Access to Certificates, Identifiers & Profiles"
│   ├─ YES → You're good! No new key needed. Check build logs.
│   └─ NO → Create new key with profile access enabled
└─ NO → Create new key
```

## Important Notes

1. **You can have multiple API keys** - having a new one doesn't break the old one
2. **Keep the old key** - you might need it for other things
3. **The new key will work immediately** - no waiting needed
4. **Download the .p8 file immediately** - you can only download once!

## After Creating New Key

1. Wait 2-3 minutes for Codemagic to recognize it
2. Run a new build
3. The build should now be able to create provisioning profiles

## Summary

**Check your existing key first!** You only need a new one if:
- It doesn't have "Access to Certificates, Identifiers & Profiles" enabled
- OR you can't see the permissions (which means it probably doesn't have it)

Most likely, if the build is failing with "No matching profiles found", your key doesn't have profile access, so you'll need a new key.

