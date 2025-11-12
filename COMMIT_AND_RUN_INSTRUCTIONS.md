# Commit & Run Workflow - Instructions

## ✅ Workflow File Updated
The workflow file `.github/workflows/ios_testflight.yml` has been updated with the OpenSSL PEM import fix.

## 📍 Current Situation
You're currently in: `C:\Users\rrwil\Desktop\AITA Project - Copy`

This directory is **not a git repository**. You need to navigate to your actual git repository.

---

## 🚀 Option 1: If Your Git Repo is Elsewhere

### Step 1: Navigate to Your Git Repository
```powershell
cd C:\path\to\Latest-Version-of-AITA
# Replace with your actual repo path
```

### Step 2: Copy the Workflow File (if needed)
If the workflow file isn't in your repo yet:
```powershell
# Copy from current directory to your repo
Copy-Item "C:\Users\rrwil\Desktop\AITA Project - Copy\.github\workflows\ios_testflight.yml" `
  -Destination "C:\path\to\Latest-Version-of-AITA\.github\workflows\ios_testflight.yml" `
  -Force
```

### Step 3: Commit and Push
```powershell
git add .github/workflows/ios_testflight.yml
git commit -m "fix(ci): import iOS signing cert via OpenSSL PEM to bypass PKCS#12 MAC bug"
git push origin main
```

### Step 4: Trigger Workflow
```powershell
$GH = "$env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe"

# Set your GitHub token if not already set
$env:GH_TOKEN = "ghp_yourPersonalAccessTokenHere"

# Authenticate
$env:GH_TOKEN | & $GH auth login --with-token

# Trigger and watch
& $GH workflow run "iOS TestFlight" --ref main --repo r0bay/Latest-Version-of-AITA
& $GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA
```

---

## 🚀 Option 2: Initialize Git Here (if this should be a repo)

If this directory should be a git repository:

```powershell
git init
git remote add origin https://github.com/r0bay/Latest-Version-of-AITA.git
git add .github/workflows/ios_testflight.yml
git commit -m "fix(ci): import iOS signing cert via OpenSSL PEM to bypass PKCS#12 MAC bug"
git push -u origin main
```

---

## ✅ What to Look For in Workflow Logs

After triggering, check the **"Create keychain & import certificate"** step:

### ✅ Success Indicators:
- `openssl ... -info` passes (no error)
- `subject=` line printed for `/tmp/dist_cert.cer`
- `security find-identity -p codesigning` lists an **Apple Distribution** identity
- **NO** "MAC verification failed" error

### ❌ If It Still Fails:
Paste the last ~60 lines of the failing step.

---

## 🔍 Quick Check: Find Your Git Repo

If you're not sure where your git repo is:

```powershell
# Search for git repos on your desktop
Get-ChildItem -Path "$env:USERPROFILE\Desktop" -Filter ".git" -Directory -Recurse -ErrorAction SilentlyContinue | 
  Select-Object FullName

# Or search for the workflow file
Get-ChildItem -Path "$env:USERPROFILE\Desktop" -Filter "ios_testflight.yml" -Recurse -ErrorAction SilentlyContinue | 
  Select-Object FullName
```

---

## 📝 Manual Alternative (Web UI)

If you prefer not to use CLI:

1. **Copy the workflow file** to your repo's `.github/workflows/` directory
2. **Commit via GitHub Desktop** or web interface
3. **Trigger workflow** at: https://github.com/r0bay/Latest-Version-of-AITA/actions
   - Click "iOS TestFlight"
   - Click "Run workflow" → "Run workflow"

---

## 🎯 Current Workflow File Location

The updated workflow file is at:
```
C:\Users\rrwil\Desktop\AITA Project - Copy\.github\workflows\ios_testflight.yml
```

Copy this to your actual git repository's `.github/workflows/` directory.

