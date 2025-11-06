# Step-by-Step Guide: Upload Build to App Store Connect

## Prerequisites Check

Before starting, make sure:
- ✅ You have a Mac with Xcode installed (iOS builds require macOS)
- ✅ You're signed into Xcode with your Apple Developer account
- ✅ Your app is created in App Store Connect
- ✅ Bundle ID `app.randomaita.final` is registered in App Store Connect

## Step 1: Sync iOS Project

```bash
cd "C:\Users\rrwil\Desktop\AITA Project - Copy"
npx cap sync ios
```

This ensures all changes from your web code are copied to the iOS project.

## Step 2: Open in Xcode

```bash
npx cap open ios
```

This will open Xcode with your iOS project.

## Step 3: Verify Project Settings

1. In Xcode, click on **"App"** project in the left sidebar (top item, blue icon)
2. Select **"App"** under TARGETS (not PROJECTS)
3. Click **"General"** tab
4. Verify:
   - **Display Name**: Random AITA
   - **Bundle Identifier**: `app.randomaita.final`
   - **Version**: `1.0.0`
   - **Build**: `1` (or increment if you've uploaded before)

## Step 4: Configure Signing & Capabilities

1. Still with **"App"** target selected
2. Click **"Signing & Capabilities"** tab
3. Check **"Automatically manage signing"**
4. Select your **Team** (your Apple Developer account should appear here)
5. Xcode will automatically create provisioning profiles

**If you see errors:**
- Make sure Bundle ID `app.randomaita.final` is registered in App Store Connect
- Make sure you're signed into Xcode with the correct Apple ID
- Try clicking "Try Again" or "Download Manual Profiles"

## Step 5: Select Build Target

1. At the top of Xcode, you'll see a device selector (usually shows "App > iPhone 15 Pro" or similar)
2. Click it and select **"Any iOS Device"** (NOT a simulator like "iPhone 15 Pro Simulator")
3. This is critical - you cannot archive from a simulator

## Step 6: Clean Build Folder (Optional but Recommended)

1. Go to **Product** → **Clean Build Folder** (or press `Shift + Command + K`)
2. This ensures a fresh build

## Step 7: Archive the App

1. Go to **Product** → **Archive**
2. Wait for the build to complete (this may take 5-10 minutes)
3. You'll see a progress indicator at the top of Xcode
4. When done, the **Organizer** window will open automatically

## Step 8: Verify Archive

In the Organizer window:
1. You should see your archive listed (with name "App" and date)
2. Make sure it shows:
   - Version: 1.0.0
   - Build: 1 (or your build number)
   - Bundle ID: app.randomaita.final

## Step 9: Distribute to App Store Connect

1. In Organizer, select your archive
2. Click **"Distribute App"** button
3. Select **"App Store Connect"** and click **Next**
4. Select **"Upload"** and click **Next**
5. Select distribution options:
   - ✅ **Upload your app's symbols** (recommended - helps with crash reports)
   - ✅ **Manage Version and Build Number** (if you want Xcode to manage it)
6. Click **Next**

## Step 10: Review and Upload

1. Review the summary:
   - App: Random AITA
   - Bundle ID: app.randomaita.final
   - Version: 1.0.0
   - Build: 1
2. Click **"Upload"**
3. Wait for upload to complete (5-10 minutes)
4. You'll see progress: "Uploading..." then "Upload Successful"

## Step 11: Wait for Processing

1. Go to https://appstoreconnect.apple.com
2. Go to **"My Apps"** → **"Random AITA"**
3. Click **"TestFlight"** tab
4. Your build will appear with status **"Processing"**
5. Wait 10-60 minutes for processing to complete
6. Status will change to **"Ready to Submit"** when done

## Step 12: Select Build for Submission

1. Go to **"App Store"** → **"iOS App"** → **"1.0 Prepare for Submission"**
2. Scroll down to **"Build"** section
3. Click **"+"** or **"Select a build before you submit your app"**
4. Your processed build should appear in the list
5. Select it and click **"Done"**

## Troubleshooting

### Error: "No suitable application records were found"
**Solution**: Make sure you created the app in App Store Connect BEFORE uploading

### Error: "Invalid Bundle Identifier"
**Solution**: Verify Bundle ID in Xcode matches App Store Connect exactly

### Error: Signing issues
**Solution**: 
- Make sure "Automatically manage signing" is checked
- Select the correct Team
- Verify Bundle ID is registered in App Store Connect

### Build won't appear in App Store Connect
**Solutions**:
- Wait longer (processing can take up to an hour)
- Check TestFlight tab, not App Store tab
- Check your email for error notifications
- Verify upload was successful in Xcode

### "Archive" is grayed out
**Solutions**:
- Make sure "Any iOS Device" is selected (not a simulator)
- Clean build folder and try again
- Check for build errors in Xcode

## Quick Command Summary

```bash
# 1. Sync project
npx cap sync ios

# 2. Open in Xcode
npx cap open ios

# Then in Xcode:
# - Select "Any iOS Device"
# - Product → Archive
# - Distribute App → App Store Connect → Upload
```

## Next Steps After Upload

Once your build is processed and selected:
1. Fill out all app information
2. Upload screenshots
3. Complete App Review Information
4. Submit for Review

Good luck! 🚀

