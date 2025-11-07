# Complete Codemagic API Key Setup

## Your Information

- **Issuer ID:** `05df1fa0-6dbf-4ecd-a99a-01c92045dcd1`
- **Key ID:** `5DY2K29Z5XXJ`
- **API Key Name:** `apple_credentials` (or any name you prefer)

## Note About Issuer ID and Developer ID

**For individual developer accounts**, Apple sometimes uses the same value for both Developer ID and Issuer ID. This is normal and correct!

- **Developer ID:** `05df1fa0-6dbf-4ecd-a99a-01c92045dcd1`
- **Issuer ID:** `05df1fa0-6dbf-4ecd-a99a-01c92045dcd1` ✅ (Same value - this is correct!)

## Complete the Codemagic Form

Fill in the Codemagic API key form with:

### 1. App Store Connect API key name
```
apple_credentials
```
(Or any name you want - this is just a label)

### 2. Issuer ID
```
05df1fa0-6dbf-4ecd-a99a-01c92045dcd1
```

### 3. Key ID
```
5DY2K29Z5XXJ
```

### 4. API key (.p8 file)
- Click "Choose a .p8 file" or drag and drop
- Select your `.p8` file from your computer
- The file should be named something like: `AuthKey_5DY2K29Z5XXJ.p8`

## Important: Do You Have the .p8 File?

**Critical Question:** Do you have the `.p8` file?

- ✅ **If YES:** Upload it to Codemagic
- ❌ **If NO:** You need to create a new API key because you can only download the `.p8` file once when creating the key

## If You Don't Have the .p8 File

If you lost the `.p8` file, you need to create a new API key:

1. Go to App Store Connect (wherever you can access API keys)
2. Create a new API key
3. Download the `.p8` file immediately
4. Use the new Key ID and upload the new `.p8` file to Codemagic

## After Filling the Form

1. **Click "Save"** or "Add Integration"
2. **Wait 1-2 minutes** for Codemagic to process
3. **Verify** it shows as "Active" or "Connected"
4. **Run a build** to test

## Quick Checklist

- [x] Issuer ID: `05df1fa0-6dbf-4ecd-a99a-01c92045dcd1` ✅
- [x] Key ID: `5DY2K29Z5XXJ` ✅
- [ ] API key name: `apple_credentials` (or your choice)
- [ ] .p8 file: [Do you have it?]

## Next Steps

1. **Complete the Codemagic form** with the values above
2. **Upload your .p8 file** (or create a new key if you don't have it)
3. **Save the integration**
4. **Run a new build** to test

Once this is set up, your builds should be able to create provisioning profiles automatically!

