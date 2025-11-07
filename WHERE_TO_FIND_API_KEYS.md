# Where to Find API Keys in App Store Connect

## Step-by-Step Guide

### Step 1: Go to App Store Connect

1. Open your web browser
2. Go to: **https://appstoreconnect.apple.com**
3. Sign in with your Apple Developer account

### Step 2: Navigate to Users and Access

Once signed in, you have two ways to get to the keys:

**Option A: From the Top Menu**
1. Look at the top right of the page
2. You should see your name or account info
3. Click on **"Users and Access"** (or look for a dropdown menu)

**Option B: Direct URL**
1. Go directly to: **https://appstoreconnect.apple.com/access/users**
2. This takes you to the Users and Access section

### Step 3: Go to Keys Section

1. In the **Users and Access** page, look at the top tabs
2. You should see tabs like: **"Users"**, **"Keys"**, **"Access Roles"**, etc.
3. Click on the **"Keys"** tab

### Step 4: View Your Keys

1. You'll see a list of all your API keys
2. Look for a key with:
   - **Name**: Something like "Codemagic CI/CD" or whatever you named it
   - **Key ID**: Should show `5DY2K29Z5XXJ` (or similar)
   - **Status**: Should show "Active" or "Inactive"

### Step 5: View Key Details

1. Click on the key (the Key ID or name)
2. This opens the key details page
3. You'll see:
   - **Key ID**: The identifier
   - **Role**: Admin, App Manager, etc.
   - **Access to Certificates, Identifiers & Profiles**: This is what you need to check!
   - **Status**: Active/Inactive
   - **Created**: Date

## Direct Link

You can go directly to the keys page:
**https://appstoreconnect.apple.com/access/api**

This takes you straight to the Keys section.

## Visual Guide

```
App Store Connect
  → Users and Access (top right menu)
    → Keys (tab at top)
      → Your Keys List
        → Click on Key ID: 5DY2K29Z5XXJ
          → Key Details Page
            → Check "Access to Certificates, Identifiers & Profiles"
```

## What You're Looking For

In the key details, you need to verify:
- ✅ **Access to Certificates, Identifiers & Profiles**: Should be **ENABLED** or show a checkmark
- ✅ **Role**: Should be **Admin** or **App Manager**
- ✅ **Status**: Should be **Active**

## If You Can't Find It

If you don't see "Keys" tab:
1. Make sure you're signed in with an account that has admin access
2. Try the direct URL: https://appstoreconnect.apple.com/access/api
3. Check if you're in the right team/account (top right corner)

## Quick Checklist

- [ ] Go to https://appstoreconnect.apple.com
- [ ] Sign in
- [ ] Click "Users and Access" (or go to /access/api)
- [ ] Click "Keys" tab
- [ ] Find key with ID `5DY2K29Z5XXJ`
- [ ] Click on it to see details
- [ ] Check "Access to Certificates, Identifiers & Profiles"

That's it! Let me know what you see.

