# Upload Build Using Codemagic (Cloud Build)

Since you're on Windows, Codemagic is the easiest way to build and upload your iOS app to App Store Connect.

## Prerequisites

✅ Your app is already set up with Codemagic (`codemagic.yaml` exists)  
✅ Your Bundle ID is: `app.randomaita.final`  
✅ Your app is created in App Store Connect  

## Step 1: Update Codemagic Configuration (if needed)

Your `codemagic.yaml` should already have the correct Bundle ID, but verify:
- `BUNDLE_ID: app.randomaita.final`
- `APP_ID: app.randomaita.final` (this might need updating)

## Step 2: Go to Codemagic

1. Go to https://codemagic.io
2. Sign in with your GitHub account (or create account)
3. Click **"Add application"** or select your app if it's already connected

## Step 3: Connect Your Repository

1. Select your GitHub repository: `r0bay/Latest-Version-of-AITA`
2. Codemagic will detect your `codemagic.yaml` file
3. Select the **iOS workflow** (should be named "iOS Workflow")

## Step 4: Configure App Store Connect Integration

1. In Codemagic, go to **Teams** → **Integrations**
2. Find **"App Store Connect"** integration
3. Make sure it's connected with:
   - **Key ID**: Your App Store Connect API Key ID
   - **Issuer ID**: Your App Store Connect Issuer ID
   - **Private Key**: Your `.p8` file uploaded

If not set up:
1. Go to https://appstoreconnect.apple.com/access/api
2. Create an API key
3. Download the `.p8` file
4. Note the Key ID and Issuer ID
5. Add these to Codemagic integrations

## Step 5: Start a Build

1. In Codemagic, go to your app
2. Click **"Start new build"**
3. Select:
   - **Workflow**: iOS Workflow
   - **Branch**: `main` (or your working branch)
4. Click **"Start build"**

## Step 6: Monitor Build Progress

Codemagic will:
1. Clone your repository
2. Install dependencies
3. Build your iOS app
4. Upload to App Store Connect automatically

This takes 15-30 minutes typically.

## Step 7: Check Build Status

1. Watch the build logs in Codemagic
2. Look for "Uploading to App Store Connect" step
3. Wait for "Build finished" status

## Step 8: Verify in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Go to **"My Apps"** → **"Random AITA"**
3. Click **"TestFlight"** tab
4. Your build should appear with status **"Processing"**
5. Wait 10-60 minutes for processing
6. Status changes to **"Ready to Submit"**

## Step 9: Select Build for Submission

1. Go to **"App Store"** → **"iOS App"** → **"1.0 Prepare for Submission"**
2. Scroll to **"Build"** section
3. Click **"+"** or **"Select a build before you submit your app"**
4. Select your processed build
5. Click **"Done"**

## Troubleshooting Codemagic

### Build fails at code signing
- Make sure Bundle ID `app.randomaita.final` is registered in App Store Connect
- Verify App Store Connect integration is connected
- Check that API key has proper permissions

### Build uploads but doesn't appear
- Check TestFlight tab, not App Store tab
- Wait longer (processing can take up to an hour)
- Check email for error notifications from Apple

### Codemagic can't find the app
- Make sure app is created in App Store Connect first
- Verify Bundle ID matches exactly

## Quick Checklist

Before building in Codemagic:
- [ ] Bundle ID `app.randomaita.final` registered in App Store Connect
- [ ] App "Random AITA" created in App Store Connect
- [ ] App Store Connect API integration set up in Codemagic
- [ ] `codemagic.yaml` has correct Bundle ID
- [ ] All code changes committed and pushed to GitHub

## Alternative: Manual Upload from Mac

If you have access to a Mac:
1. Follow `UPLOAD_BUILD_GUIDE.md`
2. Build and upload directly from Xcode
3. Faster feedback, but requires Mac

Good luck! 🚀

