# How to Verify API Key Permissions in Codemagic

## Step-by-Step Guide

### Step 1: Go to Codemagic Integrations

1. Go to https://codemagic.io
2. Sign in to your account
3. In the left sidebar, click **"Teams"** (or click on your team name)
4. Click **"Integrations"** tab (or "Team integrations")

### Step 2: Find Developer Portal Integration

1. Scroll down to find **"Developer Portal"** in the integrations list
2. It should show:
   - ✅ Green dot (indicating it's connected)
   - Text: "Apple Developer Portal integration for automatic code signing has been connected using 1 key"
   - Button: **"Manage keys"**

### Step 3: Click "Manage keys"

1. Click the **"Manage keys"** button next to Developer Portal
2. This will open a page showing your API keys

### Step 4: View Key Details

You should see your API key listed with:
- **Key ID**: `5DY2K29Z5XXJ` (this should match what you see)
- **Status**: Should show as **"Active"** or **"Connected"**
- **Role**: Should show the role (Admin, App Manager, etc.)
- **Issuer ID**: Should be displayed
- **Created**: Date when the key was created

### Step 5: Check Key Permissions

Look for the **Role** or **Permissions** section. It should show one of:
- ✅ **"Admin"** - Full access (recommended)
- ✅ **"App Manager"** - Can manage apps and create profiles (should work)
- ❌ **"Developer"** - Limited access (might not work for code signing)
- ❌ **"Marketing"** - No access to code signing (won't work)

### Step 6: Verify Key is Active

Make sure the key shows:
- ✅ Status: **"Active"** or **"Connected"**
- ❌ NOT: **"Revoked"**, **"Expired"**, or **"Inactive"**

## What to Look For

### ✅ Good Signs (Key Should Work):
- Status: **Active**
- Role: **Admin** or **App Manager**
- Key ID matches: `5DY2K29Z5XXJ`

### ❌ Bad Signs (Key Won't Work):
- Status: **Revoked** or **Expired**
- Role: **Developer** or **Marketing** (insufficient permissions)
- Key ID doesn't match

## If Key Doesn't Have Right Permissions

If your key doesn't have "Admin" role:

### Option 1: Check in App Store Connect

1. Go to https://appstoreconnect.apple.com/access/api
2. Click **"Keys"** tab
3. Find key with ID `5DY2K29Z5XXJ`
4. Check the **Role** column
5. If it's not "Admin", you need to create a new key

### Option 2: Create New API Key (If Needed)

If the current key doesn't have Admin permissions:

1. **Go to App Store Connect:**
   - Visit: https://appstoreconnect.apple.com/access/api
   - Click **"Keys"** tab

2. **Create New Key:**
   - Click **"+"** button (plus icon, top left)
   - Enter name: **"Codemagic CI/CD"** (or any name)
   - Select role: **"Admin"** (important!)
   - Click **"Generate"**

3. **Download and Save:**
   - **CRITICAL:** Download the `.p8` file immediately (you can only download once!)
   - Note the new **Key ID**
   - Note the **Issuer ID** (shown at top of page)

4. **Update Codemagic:**
   - Go back to Codemagic → Teams → Integrations
   - Click **"Manage keys"** on Developer Portal
   - Click **"Add key"** or **"Update"**
   - Enter:
     - New Key ID
     - Issuer ID
     - Upload the new `.p8` file
   - Click **"Save"**

## Alternative: Check Key Status in App Store Connect

You can also verify the key directly in App Store Connect:

1. Go to https://appstoreconnect.apple.com/access/api
2. Click **"Keys"** tab
3. Find key with ID `5DY2K29Z5XXJ`
4. Check:
   - **Status**: Should be "Active"
   - **Role**: Should be "Admin" or "App Manager"
   - **Created**: Date

## Visual Guide

```
Codemagic Dashboard
  → Teams (left sidebar)
    → Integrations
      → Developer Portal
        → [Manage keys] button
          → Key Details Page
            → Key ID: 5DY2K29Z5XXJ
            → Status: Active
            → Role: Admin
            → Issuer ID: [shown]
```

## Quick Checklist

When viewing "Manage keys":
- [ ] Key ID `5DY2K29Z5XXJ` is listed
- [ ] Status shows **"Active"**
- [ ] Role shows **"Admin"** or **"App Manager"**
- [ ] Issuer ID is displayed
- [ ] Key is not expired or revoked

## If You Can't Find "Manage keys"

If you don't see a "Manage keys" button:
1. Make sure you're in the correct team
2. Check you have admin permissions in Codemagic
3. Try refreshing the page
4. Look for "Configure" or "Edit" button instead

## Troubleshooting

### Can't Access Manage Keys?

- Make sure you're an admin/owner of the team in Codemagic
- Try logging out and back in
- Check if you're in the correct team/organization

### Key Shows as Inactive?

- The key might have been revoked in App Store Connect
- Check in App Store Connect → Keys
- If revoked, create a new key and update Codemagic

### Role is Not Admin?

- You'll need to create a new API key with Admin role
- Old keys can't have their role changed
- Follow "Option 2" above to create a new key

## Next Steps

After verifying the key:
1. If key has **Admin** role → You're good to go! Try a build.
2. If key has **App Manager** role → Should work, but Admin is recommended.
3. If key has lower permissions → Create a new Admin key and update Codemagic.

Once the key permissions are correct, your Codemagic builds should work!

