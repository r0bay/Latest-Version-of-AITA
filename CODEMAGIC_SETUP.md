# Codemagic Cloud Build Setup Guide

Codemagic is a cloud CI/CD service specifically designed for mobile apps. It's perfect for building iOS apps without a Mac.

## Step 1: Create Codemagic Account

1. Go to https://codemagic.io
2. Sign up with GitHub (free to start)
3. You get 500 build minutes/month free

## Step 2: Connect Your Repository

1. In Codemagic dashboard, click "Add application"
2. Select your GitHub repository
3. Choose "iOS" as the platform

## Step 3: Configure Build Settings

Codemagic will auto-detect Capacitor, but you need to configure it. Here's what to add:

### Build Configuration

In Codemagic, go to your app → "Configuration" → "iOS" and use this config:

```yaml
workflows:
  ios-workflow:
    name: iOS Workflow
    max_build_duration: 120
    instance_type: mac_mini_m1
    environment:
      groups:
        - apple_credentials # Add your Apple Developer credentials here
      vars:
        APP_ID: com.randomaita.app
        XCODE_WORKSPACE: "ios/App/App.xcworkspace"
        XCODE_SCHEME: "App"
        BUNDLE_ID: com.randomaita.app
    scripts:
      - name: Install dependencies
        script: |
          npm install
      - name: Install CocoaPods dependencies
        script: |
          cd ios/App
          pod install
      - name: Set up code signing settings on Xcode project
        script: |
          xcode-project use-profiles
      - name: Build ipa for distribution
        script: |
          xcodebuild build archive \
            -workspace "$XCODE_WORKSPACE" \
            -scheme "$XCODE_SCHEME" \
            -archivePath "$CM_BUILD_DIR/build.xcarchive" \
            -allowProvisioningUpdates
      - name: Export IPA
        script: |
          xcodebuild -exportArchive \
            -archivePath "$CM_BUILD_DIR/build.xcarchive" \
            -exportOptionsPlist export_options.plist \
            -exportPath "$CM_BUILD_DIR"
    artifacts:
      - build/**/*.xcarchive
      - build/**/*.ipa
    publishing:
      email:
        recipients:
          - your-email@example.com
        notify:
          success: true
          failure: false
      app_store_connect:
        auth: integration
        
        submit_to_testflight: false
        submit_to_app_store: true # Set to true to auto-submit
        beta_groups: # Optional: for TestFlight
          - group name 1
          - group name 2
```

## Step 4: Set Up Apple Developer Credentials

1. In Codemagic, go to "Teams" → "Integrations"
2. Click "Add integration" → "App Store Connect"
3. Generate an API key:
   - Go to https://appstoreconnect.apple.com
   - Users and Access → Keys → App Store Connect API
   - Generate new key
   - Download the `.p8` file
   - Note the Key ID and Issuer ID
4. In Codemagic, enter:
   - Key ID
   - Issuer ID
   - Upload the `.p8` file
   - Save as "apple_credentials"

## Step 5: Create Export Options File

Create `export_options.plist` in your project root:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
</dict>
</plist>
```

## Step 6: Update Your Project

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add Codemagic configuration"
   git push
   ```

2. In Codemagic, click "Start new build"
3. Select your branch (usually `main`)
4. Click "Start build"

## Step 7: First Build - Manual App Store Submission

For the first build, you might want to:
1. Set `submit_to_app_store: false` initially
2. Download the `.ipa` file
3. Manually upload via Transporter app or Xcode Organizer

## Alternative: Simpler Workflow

If the above seems complex, Codemagic has a "Flutter/Capacitor" template you can use:
1. Add application → Select your repo
2. Click "Configure workflow"
3. Select "Flutter" template (works for Capacitor too)
4. Modify the generated config as needed

## Need Help?

- Codemagic Docs: https://docs.codemagic.io
- Capacitor specific: https://docs.codemagic.io/building/capacitor/



