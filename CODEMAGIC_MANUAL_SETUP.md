# Manual Codemagic Configuration (Web UI)

If Codemagic isn't detecting your `codemagic.yaml` file, you can configure it manually in the web interface.

## Step 1: Add Your Application

1. In Codemagic dashboard, click "Add application"
2. Select your GitHub repository
3. **Project path:** Leave empty (or `.`)
4. **Branch:** Select `main`
5. **Project type:** Select "iOS" manually
6. Click "Add application"

## Step 2: Configure Workflow

Once your app is added:

1. Click on your app name
2. Click "Configure workflow" (or "Settings" → "Workflow editor")
3. You'll see a visual workflow editor

## Step 3: Set Up Build Scripts

Add these scripts in order:

### Script 1: Install Node.js dependencies
- **Script name:** `Install Node.js dependencies`
- **Script content:**
```bash
npm install
```

### Script 2: Install CocoaPods dependencies
- **Script name:** `Install CocoaPods dependencies`
- **Script content:**
```bash
cd ios/App
pod install
cd ../..
```

### Script 3: Set up code signing
- **Script name:** `Set up code signing`
- **Script content:**
```bash
xcode-project use-profiles
```

### Script 4: Build archive
- **Script name:** `Build archive`
- **Script content:**
```bash
xcodebuild build archive \
  -workspace "ios/App/App.xcworkspace" \
  -scheme "App" \
  -archivePath "$CM_BUILD_DIR/build.xcarchive" \
  -allowProvisioningUpdates
```

### Script 5: Export IPA
- **Script name:** `Export IPA`
- **Script content:**
```bash
xcodebuild -exportArchive \
  -archivePath "$CM_BUILD_DIR/build.xcarchive" \
  -exportOptionsPlist export_options.plist \
  -exportPath "$CM_BUILD_DIR"
```

## Step 4: Environment Variables

Go to "Environment variables" section and add:

- `APP_ID`: `com.randomaita.app`
- `XCODE_WORKSPACE`: `ios/App/App.xcworkspace`
- `XCODE_SCHEME`: `App`
- `BUNDLE_ID`: `com.randomaita.app`

## Step 5: Code Signing

1. Go to "Code signing" section
2. Select "Automatic code signing"
3. You'll need to set up your Apple Developer credentials (see next section)

## Step 6: Build Settings

- **Instance type:** `mac_mini_m1` (recommended)
- **Max build duration:** `120` minutes

## Step 7: Artifacts

In "Artifacts" section, add:
- `build/**/*.xcarchive`
- `build/**/*.ipa`

## Step 8: Publishing (Optional for now)

- **Email notifications:** Enable
- **App Store Connect:** Configure after first successful build

## Step 9: Save and Build

1. Click "Save" or "Save workflow"
2. Click "Start new build"
3. Select branch `main`
4. Click "Start build"

## Alternative: Use YAML Editor

Instead of visual editor:

1. In workflow settings, look for "YAML" tab or "Edit YAML" button
2. Copy the entire contents of `codemagic.yaml` file
3. Paste it into the YAML editor
4. Save

This should work even if auto-detection didn't!



