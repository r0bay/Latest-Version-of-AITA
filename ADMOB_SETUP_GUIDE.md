# AdMob Setup Guide for iOS App

## Overview
The app is now configured to show ads after every 5 dice clicks. You need to set up AdMob for iOS to make this work.

## Current Implementation

✅ **Already Done:**
- Ad counter logic is implemented
- Ads will trigger after every 5 dice clicks
- Code is ready to use AdMob plugin

## Step 1: Install AdMob Plugin

```bash
npm install @capacitor-community/admob
npx cap sync ios
```

## Step 2: Get AdMob App ID

1. Go to https://admob.google.com
2. Sign in with your Google account
3. Create a new app (or use existing)
4. Get your **App ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)
5. Get your **Interstitial Ad Unit ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`)

## Step 3: Configure AdMob in iOS

### Update Info.plist

Add to `ios/App/App/Info.plist`:

```xml
<key>GADApplicationIdentifier</key>
<string>YOUR_APP_ID_HERE</string>
<key>SKAdNetworkItems</key>
<array>
  <dict>
    <key>SKAdNetworkIdentifier</key>
    <string>cstr6suwn9.skadnetwork</string>
  </dict>
</array>
```

### Update AppDelegate.swift

In `ios/App/App/AppDelegate.swift`, add:

```swift
import UIKit
import Capacitor
import GoogleMobileAds

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize AdMob
        GADMobileAds.sharedInstance().start(completionHandler: nil)
        return true
    }
}
```

## Step 4: Update Podfile

Add to `ios/App/Podfile`:

```ruby
pod 'Google-Mobile-Ads-SDK'
```

Then run:
```bash
cd ios/App
pod install
cd ../..
```

## Step 5: Initialize AdMob in JavaScript

Update `static/app.js` - modify the `showAdIfNeeded` function:

```javascript
async function showAdIfNeeded() {
  const count = incrementDiceClickCount();
  
  if (count >= ADS_EVERY_N_CLICKS) {
    resetDiceClickCount();
    
    // Check if we're in a Capacitor app (iOS/Android)
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
      try {
        const { AdMob } = await import('@capacitor-community/admob');
        
        // Initialize AdMob (do this once on app start)
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          testingDevices: [], // Add test device IDs during development
          initializeForTesting: false,
        });
        
        // Prepare interstitial ad
        await AdMob.prepareInterstitial({
          adId: 'YOUR_INTERSTITIAL_AD_UNIT_ID',
          isTesting: false, // Set to true for testing
        });
        
        // Show the ad
        await AdMob.showInterstitial();
        return;
      } catch (error) {
        console.error('AdMob error:', error);
      }
    }
  }
}
```

## Step 6: Test Ads

1. Use test ad unit IDs during development:
   - Interstitial Test ID: `ca-app-pub-3940256099942544/4411468910`

2. Add your device as a test device:
   - Get your device ID from AdMob console
   - Add it to `testingDevices` array

## Step 7: Production

1. Replace test ad IDs with your real ad unit IDs
2. Set `isTesting: false`
3. Set `initializeForTesting: false`
4. Build and submit to App Store

## Important Notes

- **Ad Policy**: Make sure your app complies with AdMob policies
- **User Experience**: Ads show after every 5 dice clicks (not too intrusive)
- **Testing**: Always test ads before submitting to App Store
- **Revenue**: You'll need to set up payment info in AdMob to receive revenue

## Troubleshooting

- **Ads not showing**: Check AdMob console for errors
- **Build errors**: Make sure pods are installed (`pod install`)
- **Plugin not found**: Run `npx cap sync ios` after installing plugin

## Next Steps

1. Install the AdMob plugin
2. Get your AdMob App ID and Ad Unit IDs
3. Configure iOS files (Info.plist, AppDelegate.swift, Podfile)
4. Update the JavaScript code with your ad IDs
5. Test with test ad IDs
6. Replace with production IDs before App Store submission

