#!/bin/bash
set -euo pipefail

echo "=== Xcode Cloud: Post Clone Script ==="
echo ""

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm ci

# Sync Capacitor to iOS
echo "Syncing Capacitor to iOS..."
npx cap sync ios

# Install CocoaPods dependencies
echo "Installing CocoaPods dependencies..."
cd ios/App
pod install --repo-update
cd ../..

echo "=== Post Clone Script Complete ==="





