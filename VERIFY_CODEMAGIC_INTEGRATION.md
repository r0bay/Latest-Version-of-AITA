# Verify Codemagic Integration Setup

## Your Current Setup

You have:
- ✅ **Integration name**: `apple_credentials`
- ✅ **Key ID**: `5DY2K29Z5XXJ`
- ✅ **Developer Portal integration**: Connected (green dot)

## Verifying Everything is Correct

### Step 1: Check Integration in Codemagic

1. Go to Codemagic → Teams → Integrations
2. Find **"Developer Portal"** (should show green dot)
3. Click **"Manage keys"**
4. Verify:
   - Key ID matches: `5DY2K29Z5XXJ`
   - Status: **Active**
   - Issuer ID: Should be displayed
   - Role: Should be **"Admin"** or **"App Manager"**

### Step 2: Verify Your Configuration

Your `codemagic.yaml` currently uses:

```yaml
environment:
  ios_signing:
    distribution_type: app_store
    bundle_identifier: app.randomaita.final
```

This configuration **automatically uses** the Developer Portal integration - you don't need to reference `apple_credentials` explicitly.

However, if builds are still failing, we might need to ensure the integration is properly linked.

### Step 3: Test the Integration

The best way to test is to start a build and see what happens. If you get errors, they'll tell us what's wrong.

## Common Issues and Fixes

### Issue 1: "No matching profiles found"

**Possible causes:**
- Bundle ID `app.randomaita.final` exists but app isn't created in App Store Connect
- API key doesn't have permission to create provisioning profiles

**Fix:**
1. Verify app "AITA Randomizer" exists in App Store Connect
2. Check API key has "Admin" role (not just "App Manager")
3. Wait 5-10 minutes after creating app, then retry build

### Issue 2: "No Accounts" or "Invalid credentials"

**Possible causes:**
- API key expired or revoked
- Key ID or Issuer ID incorrect
- Integration not properly connected

**Fix:**
1. Go to App Store Connect → Keys
2. Verify key `5DY2K29Z5XXJ` is still active
3. Check if it was revoked
4. If revoked, create a new key and update Codemagic

### Issue 3: Integration Not Found

If Codemagic can't find the integration:

**Fix:**
- With `ios_signing`, Codemagic should automatically use Developer Portal
- But if needed, you can explicitly reference it (see Alternative Configuration below)

## Alternative Configuration (If Needed)

If `ios_signing` doesn't work automatically, you can try explicitly referencing the integration. However, this is usually not needed with the current Codemagic setup.

**Option 1: Keep current config (recommended)**
```yaml
environment:
  ios_signing:
    distribution_type: app_store
    bundle_identifier: app.randomaita.final
```

**Option 2: Explicit integration reference (if needed)**
```yaml
integrations:
  app_store_connect: apple_credentials

environment:
  ios_signing:
    distribution_type: app_store
    bundle_identifier: app.randomaita.final
```

## What to Check Now

1. **In Codemagic:**
   - [ ] Developer Portal shows green dot (connected)
   - [ ] Key ID `5DY2K29Z5XXJ` is listed in "Manage keys"
   - [ ] Key status is "Active"
   - [ ] Key role is "Admin" or "App Manager" with full permissions

2. **In App Store Connect:**
   - [ ] Bundle ID `app.randomaita.final` exists
   - [ ] App "AITA Randomizer" is created
   - [ ] App is linked to bundle ID `app.randomaita.final`

3. **In codemagic.yaml:**
   - [ ] `ios_signing` is configured
   - [ ] `bundle_identifier: app.randomaita.final` is correct
   - [ ] `TEAM_ID: US86BZ3GH5` matches your developer account

## Next Steps

1. **Verify the integration** by clicking "Manage keys" in Codemagic
2. **Start a test build** in Codemagic
3. **Check the build logs** for any errors
4. **Share the error message** if the build fails

The fact that you have the integration set up with key `5DY2K29Z5XXJ` is good - now we just need to make sure everything else is configured correctly.

## Quick Test

Try starting a build now. If it fails, the error message will tell us exactly what's wrong:
- Code signing issue? → Check API key permissions
- Bundle ID issue? → Verify app is created in App Store Connect
- Profile issue? → Wait and retry, or check API key permissions

Let me know what error you get (if any) and we can fix it!

