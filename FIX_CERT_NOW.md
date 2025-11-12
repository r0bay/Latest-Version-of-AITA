# Fix Certificate and Trigger Workflow

## ✅ Step 1: Certificate Verified
- **File**: `C:\Users\rrwil\Desktop\provisioning profile\ios_distribution.p12`
- **Size**: 3348 bytes ✓ (matches CI log)
- **Password**: `Quillwill7&!` ✓ (verified)
- **Base64**: Generated and copied to clipboard (4464 characters)

---

## Option A: Update Secrets via GitHub CLI (Recommended)

### Install GitHub CLI (if not installed)
```powershell
winget install --id GitHub.cli -e
```

### Authenticate
```powershell
$env:GH_TOKEN = "ghp_yourPersonalAccessTokenHere"  # Replace with your actual token
$GH = "$env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe"
$env:GH_TOKEN | & $GH auth login --with-token
```

### Update Secrets
```powershell
# Base64 is already in clipboard, or regenerate:
$P12 = "C:\Users\rrwil\Desktop\provisioning profile\ios_distribution.p12"
$B64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($P12))

# Update CERT_P12_BASE64
$B64 | & $GH secret set CERT_P12_BASE64 --repo r0bay/Latest-Version-of-AITA --body -

# Update P12_PASSWORD
"Quillwill7&!" | & $GH secret set P12_PASSWORD --repo r0bay/Latest-Version-of-AITA --body -
```

### Trigger Workflow
```powershell
& $GH workflow run "iOS TestFlight" --ref main --repo r0bay/Latest-Version-of-AITA
& $GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA
```

---

## Option B: Update Secrets via Web UI (Manual)

### 1. Go to GitHub Secrets
https://github.com/r0bay/Latest-Version-of-AITA/settings/secrets/actions

### 2. Update CERT_P12_BASE64
- Click **CERT_P12_BASE64** → **Update**
- Paste the Base64 from clipboard (Ctrl+V)
- Click **Update secret**

### 3. Update P12_PASSWORD
- Click **P12_PASSWORD** → **Update**
- Enter: `Quillwill7&!`
- Click **Update secret**

### 4. Trigger Workflow
- Go to: https://github.com/r0bay/Latest-Version-of-AITA/actions
- Click **iOS TestFlight** workflow
- Click **Run workflow** → **Run workflow**

---

## Quick Script (All-in-One)

If you have GitHub CLI installed and `$env:GH_TOKEN` set:

```powershell
.\fix_cert_and_trigger.ps1
```

Or with token:
```powershell
.\fix_cert_and_trigger.ps1 -GitHubToken "ghp_yourPersonalAccessTokenHere"
```

---

## Verification

After the workflow runs, check the **"Create keychain & import certificate"** step:

✅ **Success**: Should NOT show "MAC verification failed"
✅ **File size**: Should show "Certificate file size: 3348 bytes"

If it still fails:
- The Base64 in `CERT_P12_BASE64` doesn't match the verified file
- Re-run the Base64 generation and update the secret again

---

## Current Status

- ✅ Certificate file verified (3348 bytes)
- ✅ Password verified (`Quillwill7&!`)
- ✅ Base64 generated and in clipboard
- ⏳ **Next**: Update GitHub Secrets (choose Option A or B above)

