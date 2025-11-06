# App Store Submission - Step by Step Guide

## Prerequisites
- ✅ Apple Developer Account (you mentioned you already have this)
- ✅ Your app is deployed and working at: https://www.randomaita.com
- ✅ Bundle ID: `app.randomaita` (already configured)

## STEP 1: Register Bundle ID in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Sign in with your Apple Developer account
3. Click **"Certificates, Identifiers & Profiles"** (or go directly to https://developer.apple.com/account/resources/identifiers/list)
4. Click the **"+"** button (top left)
5. Select **"App IDs"** and click **Continue**
6. Select **"App"** and click **Continue**
7. Fill in:
   - **Description**: `Random AITA`
   - **Bundle ID**: Select **"Explicit"** and enter: `app.randomaita`
8. Scroll down to **"Capabilities"** - make sure **"Push Notifications"** is checked if you plan to use it later (optional)
9. Click **Continue** and then **Register**

## STEP 2: Create App in App Store Connect

1. Go back to https://appstoreconnect.apple.com
2. Click **"My Apps"** (or **"Apps"** → **"+"** → **"New App"**)
3. Click the **"+"** button (top left)
4. Fill in the form:
   - **Platform**: iOS
   - **Name**: `Random AITA`
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: Select `app.randomaita` (from Step 1)
   - **SKU**: `random-aita-001` (any unique identifier - can be anything)
   - **User Access**: Full Access (usually)
5. Click **Create**

## STEP 3: Prepare App Information

### 3.1 Privacy Policy URL (REQUIRED)
- Your privacy policy must be accessible at: `https://www.randomaita.com/privacy`
- Verify this works by visiting the URL in your browser
- Note: Apple requires this to be accessible without authentication

### 3.2 App Description (prepare these now):
- **Name**: Random AITA
- **Subtitle** (optional, 30 chars): e.g., "Random Reddit Stories"
- **Description** (up to 4000 chars): Write about what your app does
- **Keywords** (100 chars, comma-separated): e.g., "reddit,aita,stories,random,asshole"
- **Support URL**: `https://www.randomaita.com` or your GitHub repo
- **Marketing URL** (optional): Leave blank or use your website

## STEP 4: Prepare Screenshots (REQUIRED)

You'll need screenshots in these sizes:

### iPhone Screenshots:
- **6.7" Display** (iPhone 14 Pro Max, 15 Pro Max): 1290 x 2796 pixels
- **6.5" Display** (iPhone 11 Pro Max, XS Max): 1242 x 2688 pixels  
- **5.5" Display** (iPhone 8 Plus): 1242 x 2208 pixels

### iPad Screenshots (optional but recommended):
- **12.9" iPad Pro**: 2048 x 2732 pixels

### How to Take Screenshots:
1. Open your app in iOS Simulator or on a real device
2. Take screenshots showing the main features:
   - Home screen with a story
   - Favorites screen
   - Settings screen
3. You can resize screenshots later, but it's best to take them at the right size

## STEP 5: Verify App Icons

Check if you have all required icon sizes. Run this command to check:
```bash
cd ios/App/App/Assets.xcassets/AppIcon.appiconset
ls -la
```

Required sizes:
- 20x20 (@2x, @3x) = 40x40, 60x60
- 29x29 (@2x, @3x) = 58x58, 87x87
- 40x40 (@2x, @3x) = 80x80, 120x120
- 60x60 (@2x, @3x) = 120x120, 180x180
- 76x76 (@1x, @2x) = 76x76, 152x152
- 83.5x83.5 (@2x) = 167x167
- 1024x1024 (@1x) = 1024x1024 (App Store icon)

If missing, you can generate them from your 1024x1024 icon using online tools.

## STEP 6: Open Project in Xcode

1. Open terminal in your project folder
2. Run:
   ```bash
   npx cap sync ios
   ```
3. Then run:
   ```bash
   npx cap open ios
   ```
4. Xcode should open with your project

## STEP 7: Configure Signing & Capabilities

1. In Xcode, click on **"App"** project in the left sidebar (top item)
2. Select **"App"** under TARGETS (not PROJECTS)
3. Click the **"Signing & Capabilities"** tab
4. Check **"Automatically manage signing"**
5. Select your **Team** (your Apple Developer account)
6. Verify **Bundle Identifier** is: `app.randomaita`
7. Xcode should automatically create provisioning profiles (you may see a warning that will resolve)

## STEP 8: Set Version and Build Number

1. Still in Xcode, with **"App"** target selected
2. Click the **"General"** tab
3. Find **"Identity"** section:
   - **Version**: `1.0.0` (this is the user-facing version)
   - **Build**: `1` (increment this for each build you upload)

## STEP 9: Verify Capacitor Config

Check that `capacitor.config.json` has your production URL:
```json
{
  "appId": "app.randomaita",
  "appName": "Random AITA",
  "webDir": "static",
  "server": {
    "url": "https://www.randomaita.com",
    "cleartext": false
  }
}
```

If it's different, update it and run `npx cap sync ios` again.

## STEP 10: Build and Archive

1. In Xcode, at the top, change the device selector to **"Any iOS Device"** (not a simulator)
2. Go to **Product** → **Archive**
3. Wait for the build to complete (this may take a few minutes)
4. When done, the **Organizer** window should open automatically
5. If it doesn't, go to **Window** → **Organizer**

## STEP 11: Upload to App Store Connect

1. In the Organizer, select your archive
2. Click **"Distribute App"**
3. Select **"App Store Connect"** and click **Next**
4. Select **"Upload"** and click **Next**
5. Select your distribution options (usually just use defaults):
   - ✅ **Upload your app's symbols** (recommended)
   - ✅ **Manage Version and Build Number** (if you want Xcode to manage it)
6. Click **Next**
7. Review the summary and click **"Upload"**
8. Wait for upload to complete (5-10 minutes usually)
9. You'll see a success message when done

## STEP 12: Wait for Processing

1. Go back to App Store Connect (https://appstoreconnect.apple.com)
2. Go to **"My Apps"** → **"Random AITA"**
3. Click **"TestFlight"** tab (or **"App Store"** → **"iOS App"**)
4. Your build should appear with status **"Processing"** (takes 10-30 minutes)
5. Wait until status changes to **"Ready to Submit"** or **"Processing Complete"**

## STEP 13: Fill Out App Store Listing

1. In App Store Connect, go to **"App Store"** → **"App Information"**
2. Fill in:
   - **Name**: Random AITA
   - **Subtitle**: (optional)
   - **Category**: 
     - Primary: Entertainment (or News)
     - Secondary: (optional)
   - **Privacy Policy URL**: `https://www.randomaita.com/privacy`
   - **Support URL**: `https://www.randomaita.com`
3. Click **"Save"**

## STEP 14: Add App Screenshots

1. Go to **"App Store"** → **"iOS App"** → **"1.0 Prepare for Submission"**
2. Scroll to **"App Screenshots"**
3. For each device size, click **"+"** and upload your screenshots:
   - Upload at least 6.7" iPhone screenshots (required)
   - You can use the same screenshot for all sizes initially
4. Upload at least one screenshot for each required size

## STEP 15: Fill Out Version Information

1. In the same **"1.0 Prepare for Submission"** page, fill in:
   - **Description**: Write a compelling description of your app
   - **Keywords**: Comma-separated keywords (100 characters max)
   - **Support URL**: `https://www.randomaita.com`
   - **Marketing URL**: (optional)
   - **Promotional Text**: (optional, can change without new version)
   - **Copyright**: e.g., "© 2025 Your Name"

## STEP 16: Select Build

1. Scroll down to **"Build"** section
2. Click **"+"** or **"Select a build before you submit your app"**
3. Select your uploaded build (should show version 1.0.0, build 1)
4. Click **"Done"**

## STEP 17: Answer App Review Questions

1. Scroll to **"App Review Information"**
2. Fill in:
   - **Contact Information**: Your contact info
   - **Phone Number**: Your phone number
   - **Demo Account**: (if your app requires login, provide test credentials)
   - **Notes**: Any special instructions for reviewers
3. For **"Export Compliance"**:
   - Usually answer **"No"** unless your app uses encryption
   - If unsure, answer **"No"**

## STEP 18: Content Rights

1. Scroll to **"Content Rights"**
2. Answer the questions:
   - **Does your app use the App Store's trademark or copyrighted material?**: Usually **"No"**
   - **Does your app contain, display, or access third-party content?**: Probably **"Yes"** (Reddit content)
   - **Do you have the rights to this content?**: Answer appropriately (you're using Reddit's public API)

## STEP 19: Advertising Identifier (if using ads)

1. Since you're using AdMob, scroll to **"Advertising Identifier"**
2. Select **"Yes"** - your app uses the Advertising Identifier
3. This is required for apps with ads

## STEP 20: Submit for Review

1. Review all the information you've entered
2. Make sure all required fields are filled:
   - ✅ Screenshots uploaded
   - ✅ Description filled
   - ✅ Build selected
   - ✅ Privacy Policy URL set
   - ✅ Contact information filled
3. Click **"Add for Review"** or **"Submit for Review"**
4. Confirm the submission
5. You'll see status change to **"Waiting for Review"**

## STEP 21: Wait for Review

- **Typical review time**: 24-48 hours
- You'll get an email when the status changes
- Check App Store Connect for updates

## STEP 22: If Rejected

If Apple rejects your app:
1. Read the rejection reason carefully
2. Fix the issues mentioned
3. Create a new build (increment build number)
4. Upload the new build
5. Resubmit with notes explaining what you fixed

## Common Issues & Solutions

### Issue: "No suitable application records were found"
**Solution**: Make sure you created the app in App Store Connect (Step 2) BEFORE uploading the build.

### Issue: "Invalid Bundle Identifier"
**Solution**: Verify Bundle ID in Xcode matches App Store Connect exactly: `app.randomaita`

### Issue: "Missing Privacy Policy"
**Solution**: Ensure `https://www.randomaita.com/privacy` is publicly accessible without login.

### Issue: Build processing fails
**Solution**: Check email for details. Common causes:
- Missing required icons
- Invalid code signing
- Missing required capabilities

## Quick Checklist Before Submitting

- [ ] Bundle ID registered in App Store Connect
- [ ] App created in App Store Connect
- [ ] Privacy policy accessible at https://www.randomaita.com/privacy
- [ ] App icons in all required sizes
- [ ] Screenshots prepared (at least iPhone 6.7")
- [ ] Build uploaded and processed
- [ ] All app information filled out
- [ ] Build selected in version
- [ ] Contact information provided
- [ ] Ready to submit!

## Next Steps After Approval

Once approved:
1. Your app will be available on the App Store
2. You can set it to release automatically or manually
3. Monitor reviews and ratings
4. Update the app as needed with new builds

Good luck! 🚀

