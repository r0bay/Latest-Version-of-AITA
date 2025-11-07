# Developer ID vs Issuer ID - What's the Difference?

## No, They're Different!

**Developer ID** and **Issuer ID** are two different things:

### Developer ID
- **What it is:** Your unique developer account identifier
- **Format:** UUID (e.g., `05df1fa0-6dbf-4ecd-a99a-01c92045dcd1`)
- **Where you see it:** In your account settings/profile
- **What it's used for:** Identifying your developer account

### Issuer ID
- **What it is:** Your App Store Connect API issuer identifier
- **Format:** UUID (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
- **Where you see it:** On the API Keys page in App Store Connect
- **What it's used for:** Authenticating API requests to App Store Connect

## Where to Find the Issuer ID

The Issuer ID is **NOT** the same as your Developer ID. Here's where to find it:

### Method 1: From API Keys Page

1. Go to App Store Connect → Users and Access → Keys
2. Look at the **top of the page**
3. You should see text like: **"Issuer ID: [your-issuer-id]"**
4. It's usually displayed prominently at the top, separate from the keys list

### Method 2: When Creating a New Key

1. Go to App Store Connect → Users and Access → Keys
2. Click **"+"** to create a new key (or view existing key details)
3. The Issuer ID is often shown at the top of the page or in the key creation form

### Method 3: Check Existing Key Details

1. Go to App Store Connect → Users and Access → Keys
2. Click on an existing key (like your key with ID `5DY2K29Z5XXJ`)
3. The Issuer ID might be shown in the key details

## What the Issuer ID Looks Like

The Issuer ID format is similar to Developer ID but it's a **different value**:
- **Developer ID:** `05df1fa0-6dbf-4ecd-a99a-01c92045dcd1` (this is yours)
- **Issuer ID:** Will be a different UUID (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

## Important Notes

1. **Don't use Developer ID as Issuer ID** - They're different values
2. **Issuer ID is account-wide** - All API keys for your account use the same Issuer ID
3. **It's shown on the Keys page** - Look at the top of the page when viewing Keys

## If You Can't Find Issuer ID

If you can't find the Issuer ID in App Store Connect:

### Option 1: Check Codemagic (if key is already set up)

1. Go to Codemagic → Teams → Integrations
2. Click **"Manage keys"** on Developer Portal
3. If a key is already configured, the Issuer ID might be shown there (though it's often hidden for security)

### Option 2: Create a Test Key

1. Create a new API key in App Store Connect
2. When you create it, the Issuer ID is often shown on the same page
3. You don't have to use this test key - just use it to see the Issuer ID

### Option 3: Check Documentation

Sometimes Apple shows the Issuer ID in:
- API documentation pages
- Account summary pages
- Integration setup pages

## Quick Checklist

- ❌ **Developer ID:** `05df1fa0-6dbf-4ecd-a99a-01c92045dcd1` (this is NOT the Issuer ID)
- ✅ **Issuer ID:** [Find on App Store Connect → Users and Access → Keys page, at the top]

## Next Steps

1. Go to App Store Connect → Users and Access → Keys
2. Look at the **top of the page** for "Issuer ID"
3. Copy that value (it will be different from your Developer ID)
4. Use that in the Codemagic form

The Issuer ID is specifically for API authentication and is shown on the Keys page!

