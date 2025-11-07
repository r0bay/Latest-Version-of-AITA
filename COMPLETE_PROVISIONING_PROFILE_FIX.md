# Complete Fix: "No matching profiles found" Error

## The Error

```
No matching profiles found for bundle identifier "app.randomaita.final" and distribution type "app_store"
```

This means Codemagic can't find or create an App Store provisioning profile for your bundle ID.

## Complete Fix Checklist

### ✅ Step 1: Bundle ID Must Exist as App ID

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click **"+"** button
3. Select **"App IDs"** → **"App"** → Continue
4. Fill in:
   - **Description**: `Random AITA Final Version`
   - **Bundle ID**: Select **"Explicit"**
   - **Bundle ID string**: `app.randomaita.final`
   - Click **Continue**
5. **Important:** Don't enable extra capabilities unless you actually use them
   - ❌ Don't enable Push Notifications unless your app uses them
   - ❌ Don't enable Sign In with Apple unless your app uses it
   - ✅ Only enable what you actually need
6. Click **Continue** → **Register**

### ✅ Step 2: App Store Connect App Must Exist

1. Go to https://appstoreconnect.apple.com
2. Click **"My Apps"**
3. Click **"+"** → **"New App"**
4. Fill in:
   - **Platform**: iOS
   - **Name**: `Random AITA` (or `AITA Randomizer`)
   - **Primary Language**: English
   - **Bundle ID**: Select `app.randomaita.final` from dropdown
   - **SKU**: `random-aita-final-2025` (any unique identifier)
   - **User Access**: Full Access
5. Click **"Create"**

### ✅ Step 3: API Key Must Have Profile Access

1. Go to https://appstoreconnect.apple.com/access/api
2. Click **"Keys"** tab
3. Find your key (Key ID: `5DY2K29Z5XXJ`)
4. Check:
   - **Role**: Must be **"Admin"**, **"App Manager"**, or **"Developer"**
   - **Access to Certificates, Identifiers & Profiles**: Must be **ENABLED** ✅
   
**If the key doesn't have "Access to Certificates, Identifiers & Profiles":**
- You need to create a **new** API key
- Old keys can't have permissions added
- When creating new key, make sure to check **"Access to Certificates, Identifiers & Profiles"**

### ✅ Step 4: Verify Codemagic Integration

Your `codemagic.yaml` already has:
```yaml
ios_signing:
  distribution_type: app_store
  bundle_identifier: app.randomaita.final
```

This should automatically use the Developer Portal integration. The configuration looks correct!

### ✅ Step 5: Wait for Processing

After creating/updating:
- **Wait 10-15 minutes** for Apple to process
- Then try the build again

## Diagnostic Step (Added to Your Config)

I've added a diagnostic step to your `codemagic.yaml` that will:
1. Test API connection
2. List existing profiles for your bundle ID
3. Show if profiles exist or need to be created

This runs automatically before the build and shows you exactly what Apple returns.

## What the Diagnostic Will Show

When you run a build, look for this output:

```
=== Diagnosing App Store Connect Signing ===
Bundle ID: app.randomaita.final
Team ID: US86BZ3GH5
Checking API connection...
[Shows your team/user info]

Listing existing App Store profiles for app.randomaita.final...
[Shows profiles if they exist, or nothing if they don't]
```

**What you want to see:**
- At least one `IOS_APP_STORE` profile listed for `app.randomaita.final`

**If you see nothing:**
- API key might not have profile access
- App ID might not exist
- App might not be created in App Store Connect

## Common Gotchas

### 1. API Key Missing Profile Access

**Symptom:** `list-profiles` returns nothing even though App ID exists

**Fix:** Create new API key with "Access to Certificates, Identifiers & Profiles" enabled

### 2. Wrong Bundle ID

**Symptom:** Profile exists but for different bundle ID

**Fix:** 
- Verify bundle ID in `capacitor.config.json`: `app.randomaita.final`
- Verify bundle ID in Xcode project
- Verify bundle ID in App Store Connect app

### 3. Extra Capabilities Enabled

**Symptom:** Profile creation fails due to capability mismatch

**Fix:**
- Don't enable capabilities on App ID unless your app actually uses them
- Keep capabilities minimal (only what you need)

### 4. Multiple Apple Teams

**Symptom:** API key on different team than App ID

**Fix:**
- Verify Team ID in Codemagic (`US86BZ3GH5`) matches the team where App ID exists
- Use `app-store-connect whoami` to see which team the API key uses

### 5. Wrong Profile Type

**Symptom:** Profile exists but is wrong type

**Fix:**
- Ensure profile type is `IOS_APP_STORE` (not Ad Hoc or Development)
- Codemagic config already sets this correctly: `distribution_type: app_store`

## Updated Configuration

I've updated your `codemagic.yaml` to:
1. ✅ Add diagnostic step to check profiles before build
2. ✅ Add `fetch-signing-files` command to create profiles if missing
3. ✅ Better error handling and logging

## Next Steps

1. **Verify all checklist items above** ✅
2. **Check API key has profile access** (Step 3)
3. **Wait 10-15 minutes** after creating/updating anything
4. **Run a build** and check the diagnostic output
5. **Look for the profile in the diagnostic output**

## If It Still Fails

Share the diagnostic output from the build logs:
- What does `app-store-connect whoami` show?
- What does `list-profiles` show?
- Any error messages?

This will tell us exactly what's missing!

