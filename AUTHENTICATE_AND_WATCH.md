# Authenticate and Watch Workflow

## ✅ Status
- Workflow file committed and pushed ✓
- Commit: `05fcac7` - "fix(ci): import iOS signing cert via OpenSSL PEM to bypass PKCS#12 MAC bug"
- Workflow should be running automatically on GitHub

## 🔐 Step 1: Authenticate GitHub CLI

You need a GitHub Personal Access Token with `repo` and `workflow` scopes.

### Option A: Use Existing Token
If you already have a token:
```powershell
$env:GH_TOKEN = "ghp_yourPersonalAccessTokenHere"
$GH = "C:\Program Files\GitHub CLI\gh.exe"
$env:GH_TOKEN | & $GH auth login --with-token
```

### Option B: Create New Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: "Workflow Watcher"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. Copy the token (starts with `ghp_`)

Then authenticate:
```powershell
$env:GH_TOKEN = "ghp_pasteYourTokenHere"
$GH = "C:\Program Files\GitHub CLI\gh.exe"
$env:GH_TOKEN | & $GH auth login --with-token
```

### Option C: Interactive Login
```powershell
$GH = "C:\Program Files\GitHub CLI\gh.exe"
& $GH auth login
# Follow the prompts
```

---

## 👀 Step 2: Watch Workflow

### Watch Current/Next Run
```powershell
$GH = "C:\Program Files\GitHub CLI\gh.exe"
& $GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA
```

### Or Trigger New Run First
```powershell
$GH = "C:\Program Files\GitHub CLI\gh.exe"
& $GH workflow run "iOS TestFlight" --ref main --repo r0bay/Latest-Version-of-AITA
& $GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA
```

---

## ✅ What to Look For

### In "Create keychain & import certificate" step:

**Success indicators:**
- ✅ `subject=` line for `/tmp/dist_cert.cer`
- ✅ `security find-identity -p codesigning` lists an **Apple Distribution** identity
- ✅ **NO** "MAC verification failed" error

### Common Upload Step Issues:

1. **"No suitable application record"**
   - **Fix**: Create the app in App Store Connect once with bundle ID `app.randomaita.final`
   - Go to: https://appstoreconnect.apple.com → My Apps → + → New App

2. **"identical binary" / "duplicate build"**
   - **Fix**: Build number is already auto-bumped. If re-running without new commits, the workflow will bump it again automatically.

3. **API key permissions error**
   - **Fix**: The App Store Connect API key must have **App Manager** or **Admin** role
   - Check at: https://appstoreconnect.apple.com/access/api

---

## 📋 View Full Logs

If the workflow fails, get full logs:
```powershell
$GH = "C:\Program Files\GitHub CLI\gh.exe"
& $GH run view --repo r0bay/Latest-Version-of-AITA --log
```

Or view in browser:
https://github.com/r0bay/Latest-Version-of-AITA/actions

---

## 🚀 Quick Script

Run this script (it will prompt for token if needed):
```powershell
.\watch_workflow.ps1
```

---

## 📝 Manual Alternative

If you prefer not to use CLI, view the workflow in browser:
**https://github.com/r0bay/Latest-Version-of-AITA/actions**

Click on the latest "iOS TestFlight" run to see logs.

