# Codemagic API Key Form Fields - What to Fill

## The Form Fields You're Seeing

When adding/editing the App Store Connect API key in Codemagic, you'll see these fields:

1. **App Store Connect API key name**
2. **Issuer ID**
3. **Key ID**
4. **API key** (upload .p8 file)

## What Each Field Means

### 1. App Store Connect API key name

**What it is:** A name you choose to identify this key in Codemagic

**What to enter:**
- Any name you want (e.g., `apple_credentials`, `App Store Connect Key`, `My API Key`)
- This is just for your reference in Codemagic
- **Important:** If your `codemagic.yaml` references a specific name (like `apple_credentials`), use that exact name

**Example:** `apple_credentials`

### 2. Issuer ID

**What it is:** Your Apple Developer account's unique identifier

**Where to find it:**
1. Go to https://appstoreconnect.apple.com/access/api
2. OR go to App Store Connect → Users and Access → Keys
3. The **Issuer ID** is shown at the top of the page
4. It looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**What to enter:**
- Copy the Issuer ID from App Store Connect
- It's a long string with dashes
- Paste it exactly as shown

### 3. Key ID

**What it is:** The unique identifier for your specific API key

**Where to find it:**
1. Go to App Store Connect → Users and Access → Keys
2. Find your key (the one you want to use)
3. The **Key ID** is shown in the list (e.g., `5DY2K29Z5XXJ`)

**What to enter:**
- Your Key ID: `5DY2K29Z5XXJ`
- Copy it exactly as shown
- No spaces, just the letters/numbers

### 4. API key (Choose .p8 file)

**What it is:** The private key file you downloaded when creating the API key

**Where to find it:**
- This is the `.p8` file you downloaded when you created the API key
- You should have saved it when you first created the key
- **Important:** You can only download this file once when creating the key!

**What to do:**
- Click "Choose a .p8 file" or drag the file into the upload area
- Select your `.p8` file from your computer
- The file should be named something like `AuthKey_5DY2K29Z5XXJ.p8`

## How to Get These Values

### If You Already Have the Key Set Up:

1. **Key ID:** You already have this: `5DY2K29Z5XXJ`
2. **Issuer ID:** You need to get this from App Store Connect
3. **.p8 file:** You need to have downloaded this when you created the key

### If You Need to Get Issuer ID:

1. Go to: https://appstoreconnect.apple.com/access/api
2. OR: App Store Connect → Users and Access → Keys
3. Look at the **top of the page** - you'll see "Issuer ID: [your-id]"
4. Copy that value

### If You Don't Have the .p8 File:

**Problem:** You can only download the `.p8` file once when creating the key. If you lost it, you need to create a new key.

**Solution:**
1. Create a new API key in App Store Connect
2. Download the `.p8` file immediately
3. Use the new Key ID and upload the new `.p8` file to Codemagic

## Complete Example

Here's what your form should look like:

```
App Store Connect API key name: apple_credentials
Issuer ID: [your-issuer-id-from-app-store-connect]
Key ID: 5DY2K29Z5XXJ
API key: [upload your .p8 file]
```

## Important Notes

1. **Name doesn't have to match** - unless your `codemagic.yaml` references a specific name
2. **Issuer ID is the same** for all keys in your account
3. **Key ID is unique** to each key
4. **.p8 file is secret** - don't share it or commit it to git
5. **You can only download .p8 once** - save it securely!

## If You're Updating an Existing Key

If you're editing an existing integration:
- You might only need to update specific fields
- If the key is working, you might not need to change anything
- Only update if something changed (like you created a new key)

## What to Do Next

1. **Get your Issuer ID** from App Store Connect
2. **Find your .p8 file** (or create a new key if you lost it)
3. **Fill in the form** with:
   - Name: `apple_credentials` (or any name)
   - Issuer ID: [from App Store Connect]
   - Key ID: `5DY2K29Z5XXJ`
   - API key: [upload .p8 file]
4. **Save** the integration

## Quick Checklist

- [ ] Key ID: `5DY2K29Z5XXJ` ✅ (you have this)
- [ ] Issuer ID: [get from App Store Connect]
- [ ] .p8 file: [find on your computer or create new key]
- [ ] Name: `apple_credentials` (or any name)

Let me know if you need help finding the Issuer ID or if you need to create a new key!

