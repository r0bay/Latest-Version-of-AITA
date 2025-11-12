# MacInCloud Signup Guide for iOS App Build

## Recommended Configuration

### 1. Plan Type
✅ **Pay-As-You-Go Managed Server Plan**
- Perfect for infrequent use (building once or occasionally)
- Pre-installed Xcode and development tools
- No need for admin access for basic iOS builds

### 2. Preset
✅ **Xcode/iOS Dev**
- Specifically designed for iOS development
- Has Xcode and iOS development tools pre-installed
- This is the preset you want!

### 3. Mac Model
✅ **Mac Mini Silicon M2** ($1.40/hour)
- Good balance of performance and cost
- 8-core CPU, 10-core GPU - plenty for building iOS apps
- M4 is faster but more expensive (only if you need maximum speed)
- M1 is older but should work fine if you want to save money

**Recommendation**: **M2** - best value for money

### 4. RAM
✅ **16GB of RAM**
- Standard option
- More than enough for Xcode and iOS builds
- 32GB+ is overkill for your needs

### 5. Location
✅ **North America East (Near New York)** or **North America West (Near Los Angeles)**
- Choose based on which is closer to you
- Lower latency = faster remote desktop experience
- Both will work fine

### 6. macOS Version
✅ **macOS Sequoia 15.7 (Supports Xcode 16.4)**
- Latest stable version
- Xcode 16.4 is pre-installed
- Perfect for your iOS app build

### 7. Payment Options

**For First-Time Use:**
✅ **7-Day Pay-As-You-Go Credit** (Start with this)
- Minimum 24-hour usage period
- Pay only for what you use
- Good for testing and getting familiar
- Auto-refills when credit runs out

**If You Know You'll Need Multiple Days:**
- **14-Day Pay-As-You-Go Credit** (5% off) - if you expect to use it for 2+ days
- **30-Day Pay-As-You-Go Credit** (10% off) - if you expect to use it for a month

**Recommendation**: Start with **7-Day PAYG Credit** - you can always upgrade later

### 8. Port Speed
✅ **100Mbps Port Speed** (Default)
- More than enough for remote desktop and file transfers
- 1Gbps is overkill unless you're doing massive file transfers
- Save the $4.20/month

### 9. SSH for Remote Build
❌ **Skip "Enable SSH for Remote Build"** (Optional)
- You'll be using Remote Desktop (VNC) to access the Mac
- SSH is only needed if you want to run builds from command line remotely
- Not necessary for your use case
- Save the $4.20/month

## Summary: Recommended Configuration

```
Plan Type: Pay-As-You-Go Managed Server Plan
Preset: Xcode/iOS Dev
Mac: Mac Mini Silicon M2
RAM: 16GB
Location: North America East (or West - choose closest)
macOS: macOS Sequoia 15.7 (Xcode 16.4)
Payment: 7-Day Pay-As-You-Go Credit
Port Speed: 100Mbps (default)
SSH: No (skip this)
```

## Estimated Cost

- **Setup**: $0 (no setup fee for PAYG)
- **Per Hour**: $1.40/hour (M2 Mac Mini)
- **Minimum Usage**: 24 hours = $33.60
- **Typical Build Time**: 10-20 minutes = $0.23 - $0.47 per build
- **Full Day**: ~$33.60

## What Happens After Signup

1. **Account Creation**: You'll receive login credentials
2. **Server Provisioning**: Usually takes 5-15 minutes
3. **Remote Desktop Access**: You'll get VNC connection details
4. **Pre-installed Tools**: Xcode 16.4 will already be installed
5. **Start Building**: Connect and start building your app!

## Next Steps After Signup

1. **Connect via Remote Desktop** (VNC)
2. **Import Certificates** into Keychain Access
3. **Clone Your Repository** or transfer files
4. **Install Dependencies** (CocoaPods, Node.js if needed)
5. **Build and Upload** to TestFlight

## Important Notes

⚠️ **No Admin Access**: Managed plans don't give you root/admin access
- This is fine for iOS development
- Most tools can be installed without admin
- If you need something installed, submit a support request

⚠️ **Minimum 24 Hours**: Each usage session has a 24-hour minimum
- Even if you only use it for 1 hour, you pay for 24 hours
- Plan your build session accordingly
- Do multiple builds/upload in one session

⚠️ **Auto-Refill**: Credits auto-refill when they run out
- Make sure to cancel auto-refill if you don't want it
- Or set a spending limit

## Alternative: If You Need Admin Access

If you find you need admin/root access, you'll need:
- **Dedicated Server Plan** (more expensive, ~$50-100/month)
- Full admin control
- Only needed if you need to install system-level tools

For iOS development, **Managed Server Plan is perfect** - you won't need admin access.





