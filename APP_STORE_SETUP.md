# Apple App Store Submission Guide

## Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at: https://developer.apple.com/programs/
   
2. **Xcode** (free from Mac App Store)
   - Requires macOS
   - You'll need a Mac to build and submit the app

3. **Deployed Flask App** (required!)
   - Your Flask app must be deployed to a server with HTTPS
   - Options: Heroku, Railway, Render, Fly.io, etc.

## Step 1: Deploy Your Flask App

### Option A: Deploy to Heroku

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

2. Login:
   ```bash
   heroku login
   ```

3. Create app:
   ```bash
   heroku create your-app-name
   ```

4. Set environment variables:
   ```bash
   heroku config:set REDDIT_CLIENT_ID=your_client_id
   heroku config:set REDDIT_CLIENT_SECRET=your_client_secret
   heroku config:set SESSION_SECRET=your_random_secret
   ```

5. Deploy:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. Get your app URL (e.g., `https://your-app-name.herokuapp.com`)

### Option B: Deploy to Railway

1. Go to https://railway.app
2. Create new project
3. Connect your GitHub repo
4. Set environment variables
5. Deploy

## Step 2: Update Capacitor Configuration

Edit `capacitor.config.json` and replace the server URL:

```json
{
  "appId": "com.randomaita.app",
  "appName": "Random AITA",
  "webDir": "static",
  "server": {
    "url": "https://your-actual-app-url.herokuapp.com",
    "cleartext": false
  }
}
```

## Step 3: Sync iOS Project

```bash
npx cap sync ios
```

## Step 4: Open in Xcode

```bash
npx cap open ios
```

This will open Xcode with your iOS project.

## Step 5: Configure iOS App in Xcode

1. **Select the App project** in the left sidebar
2. **General Tab:**
   - Change Bundle Identifier to something unique (e.g., `com.yourname.randomaita`)
   - Set Display Name: "Random AITA"
   - Set Version: "1.0.0"
   - Set Build: "1"

3. **Signing & Capabilities:**
   - Check "Automatically manage signing"
   - Select your Team (Apple Developer account)
   - Xcode will create provisioning profiles automatically

4. **Info.plist:**
   - Add any required permissions (your app likely doesn't need any special permissions)

## Step 6: Update App Icons

1. In Xcode, go to `Assets.xcassets` → `AppIcon`
2. Replace placeholder icons with your app icons:
   - You need icons in multiple sizes (20x20, 29x29, 40x40, 60x60, 76x76, 83.5x83.5, 1024x1024)
   - Use your existing icons from `/static/Icons/icon.png` and resize them

## Step 7: Build for App Store

1. In Xcode, select **Product → Archive**
2. Wait for the archive to build
3. When done, Xcode will open the Organizer window
4. Click **Distribute App**
5. Select **App Store Connect**
6. Follow the prompts to upload

## Step 8: Submit to App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Sign in with your Apple Developer account
3. Create a new app:
   - App Name: "Random AITA"
   - Primary Language: English
   - Bundle ID: (select the one you created in Xcode)
   - SKU: (any unique identifier)

4. Fill in app information:
   - Screenshots (required!)
   - Description
   - Keywords
   - Support URL
   - Privacy Policy URL (required!)

5. Submit for review

## Important Notes

- **Privacy Policy**: Apple requires a privacy policy URL. You'll need to create a privacy page and host it.
- **App Review**: Apple may take 24-48 hours to review your app
- **Guideline 4.2.2**: Your app now has native functionality (favorites, history, settings, local storage), so it should pass review!

## Troubleshooting

- If you get signing errors, make sure your Apple Developer account is active
- If the app doesn't load, check that your server URL in `capacitor.config.json` is correct and uses HTTPS
- Make sure your Flask app is accessible from the internet (not just localhost)

