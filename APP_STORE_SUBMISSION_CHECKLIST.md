# App Store Submission Checklist

## ✅ Pre-Submission Checklist

### 1. Deploy Flask App to Render
- [ ] Wait for Render deployment to complete
- [ ] Get your Render URL (e.g., `https://random-aita.onrender.com`)
- [ ] Test the app works at the Render URL
- [ ] Verify `/health` endpoint returns "ok"
- [ ] Verify `/privacy` page is accessible

### 2. Update Capacitor Configuration
- [ ] Update `capacitor.config.json` with your Render URL:
  ```json
  {
    "appId": "app.randomaita",
    "appName": "Random AITA",
    "webDir": "static",
    "server": {
      "url": "https://your-app.onrender.com",
      "cleartext": false
    }
  }
  ```
- [ ] Run `npx cap sync ios` to sync changes

### 3. Verify Bundle ID
- [x] Bundle ID is set to `app.randomaita` (already configured)
- [ ] **IMPORTANT**: Register this Bundle ID in App Store Connect:
  1. Go to https://appstoreconnect.apple.com
  2. Certificates, Identifiers & Profiles → Identifiers
  3. Click "+" to create new App ID
  4. Select "App" type
  5. Bundle ID: `app.randomaita`
  6. Description: "Random AITA"
  7. Save

### 4. App Store Connect Setup
- [ ] Create new app in App Store Connect:
  - App Name: "Random AITA"
  - Primary Language: English
  - Bundle ID: `app.randomaita` (must match Xcode)
  - SKU: `random-aita-001` (any unique identifier)

### 5. Privacy Policy (REQUIRED by Apple)
- [x] Privacy policy page exists at `/privacy`
- [ ] Privacy policy is accessible at: `https://your-app.onrender.com/privacy`
- [ ] Update privacy policy URL in App Store Connect

### 6. App Icons
- [ ] Check if app icons are properly sized
- [ ] Required sizes:
  - 20x20, 29x29, 40x40, 60x60, 76x76, 83.5x83.5, 1024x1024
- [ ] Icons are in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- [ ] If missing, resize `static/Icons/icon.png` to all required sizes

### 7. App Information for App Store
- [ ] App Name: "Random AITA"
- [ ] Subtitle: (optional, 30 characters max)
- [ ] Description: Write a compelling description
- [ ] Keywords: (100 characters max, comma-separated)
- [ ] Support URL: Your Render URL or GitHub repo
- [ ] Privacy Policy URL: `https://your-app.onrender.com/privacy`
- [ ] Marketing URL: (optional)

### 8. Screenshots (REQUIRED)
- [ ] iPhone 6.7" (iPhone 14 Pro Max, 15 Pro Max): 1290 x 2796 pixels
- [ ] iPhone 6.5" (iPhone 11 Pro Max, XS Max): 1242 x 2688 pixels
- [ ] iPhone 5.5" (iPhone 8 Plus): 1242 x 2208 pixels
- [ ] iPad Pro 12.9": 2048 x 2732 pixels
- [ ] Take screenshots of your app running on a device or simulator

### 9. Build and Archive in Xcode
- [ ] Open project: `npx cap open ios`
- [ ] Select "Any iOS Device" as build target
- [ ] Product → Archive
- [ ] Wait for archive to complete
- [ ] In Organizer, click "Distribute App"
- [ ] Select "App Store Connect"
- [ ] Follow prompts to upload

### 10. Code Signing
- [ ] In Xcode, go to Signing & Capabilities
- [ ] Check "Automatically manage signing"
- [ ] Select your Team (Apple Developer account)
- [ ] Verify Bundle Identifier: `app.randomaita`
- [ ] Xcode should automatically create provisioning profiles

### 11. Version Information
- [ ] Version: 1.0.0 (or your version)
- [ ] Build: 1 (increment for each submission)
- [ ] Set in Xcode: General tab → Version and Build

### 12. App Store Connect Submission
- [ ] Wait for build to process (can take 10-30 minutes)
- [ ] In App Store Connect, select your build
- [ ] Fill in all required information:
  - Screenshots
  - Description
  - Keywords
  - Support URL
  - Privacy Policy URL
- [ ] Answer App Review questions
- [ ] Submit for Review

## 🚨 Common Issues & Solutions

### Issue: "Bundle ID not found"
**Solution**: Register the Bundle ID in App Store Connect first (step 3)

### Issue: "No suitable application records were found"
**Solution**: Create the app in App Store Connect before uploading build

### Issue: "Invalid Bundle Identifier"
**Solution**: Make sure Bundle ID in Xcode matches App Store Connect exactly

### Issue: "Missing Privacy Policy"
**Solution**: Ensure privacy policy is accessible at the URL you provide

### Issue: App doesn't load in iOS app
**Solution**: 
- Check `capacitor.config.json` has correct Render URL
- Verify Render app is running and accessible
- Run `npx cap sync ios` after changing config

## 📝 Quick Commands

```bash
# Sync Capacitor after config changes
npx cap sync ios

# Open in Xcode
npx cap open ios

# Check if Render app is running
curl https://your-app.onrender.com/health
```

## ⏱️ Timeline

- **Build upload**: 5-10 minutes
- **Processing in App Store Connect**: 10-30 minutes
- **App Review**: 24-48 hours (usually)
- **Total**: 1-3 days from submission to approval

## 🎯 Next Steps After Render Deploys

1. Update `capacitor.config.json` with Render URL
2. Run `npx cap sync ios`
3. Register Bundle ID in App Store Connect
4. Create app in App Store Connect
5. Build and upload from Xcode
6. Fill in app information and submit

Good luck! 🚀

