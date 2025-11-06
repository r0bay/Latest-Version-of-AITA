# AdMob Production Setup

## Current Status

✅ **Installed:**
- `@capacitor-community/admob` plugin installed
- iOS configuration files updated
- JavaScript code ready

✅ **Using Test IDs:**
- App ID: `ca-app-pub-3940256099942544~1458002511` (TEST)
- Interstitial ID: `ca-app-pub-3940256099942544/4411468910` (TEST)
- `isTesting: true` (for development)

## Step 1: Get Your Real AdMob IDs

1. Go to https://admob.google.com
2. Sign in with your Google account
3. Click "Apps" → "Add app"
4. Select "iOS"
5. Enter app name: "Random AITA"
6. Get your **App ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)
7. Create an **Interstitial Ad Unit**:
   - Click "Ad units" → "Add ad unit"
   - Select "Interstitial"
   - Name it: "Random AITA Interstitial"
   - Get your **Interstitial Ad Unit ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`)

## Step 2: Update Configuration Files

### Update Info.plist

In `ios/App/App/Info.plist`, replace the test App ID:

```xml
<key>GADApplicationIdentifier</key>
<string>YOUR_REAL_APP_ID_HERE</string>
```

### Update JavaScript

In `static/app.js`, find `ADMOB_CONFIG` and update:

```javascript
const ADMOB_CONFIG = {
  appId: 'YOUR_REAL_APP_ID_HERE', // Replace with your real App ID
  interstitialId: 'YOUR_REAL_INTERSTITIAL_ID_HERE', // Replace with your real Interstitial ID
  isTesting: false // Change to false for production
};
```

## Step 3: Install CocoaPods (if not already installed)

On macOS:
```bash
sudo gem install cocoapods
```

Then install pods:
```bash
cd ios/App
pod install
cd ../..
```

## Step 4: Test with Real Ads

1. Update the IDs in the files above
2. Set `isTesting: false`
3. Build and test on a real device
4. Click the dice button 5 times
5. An ad should appear

## Step 5: Before App Store Submission

1. ✅ Replace all test IDs with real IDs
2. ✅ Set `isTesting: false`
3. ✅ Test ads on real device
4. ✅ Make sure ads comply with AdMob policies
5. ✅ Set up payment info in AdMob (to receive revenue)

## Important Notes

- **Test IDs**: Currently using Google's test IDs - these work for development
- **Real IDs**: You must replace with your real IDs before App Store submission
- **Testing**: Always test ads before submitting to App Store
- **Revenue**: Set up payment info in AdMob to receive ad revenue
- **Policy**: Make sure your app complies with AdMob policies

## Troubleshooting

- **Ads not showing**: Check console logs, verify IDs are correct
- **Build errors**: Run `pod install` in `ios/App` directory
- **Plugin not found**: Run `npx cap sync ios` after installing plugin

## Next Steps

1. Get your AdMob account set up
2. Create your app in AdMob
3. Get your real App ID and Interstitial ID
4. Update the configuration files
5. Test on a real device
6. Submit to App Store!

