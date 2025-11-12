# Exact commands to run (update REPO_PATH first)
# Copy-paste these into PowerShell after updating the path

# ⚠️ STEP 0: Update this path to your actual repository location
$REPO_PATH = "C:\path\to\Latest-Version-of-AITA"  # UPDATE THIS!

# 1) Go to repo
cd $REPO_PATH

# 2) Copy updated workflow (overwrite)
Copy-Item "C:\Users\rrwil\Desktop\AITA Project - Copy\.github\workflows\ios_testflight.yml" `
  -Destination ".github\workflows\ios_testflight.yml" -Force

# 3) Commit & push
git add .github/workflows/ios_testflight.yml
git commit -m "fix(ci): import iOS signing cert via OpenSSL PEM to bypass PKCS#12 MAC bug"
git push origin main

# 4) Trigger workflow and watch
$GH = "$env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe"
& $GH workflow run "iOS TestFlight" --ref main --repo r0bay/Latest-Version-of-AITA
& $GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA

# Log check (Create keychain & import certificate step):
# Expect to see:
#   - openssl ... -info pass (no error)
#   - subject= line for /tmp/dist_cert.cer
#   - security find-identity -p codesigning listing an Apple Distribution identity
#   - NO "MAC verification failed"

