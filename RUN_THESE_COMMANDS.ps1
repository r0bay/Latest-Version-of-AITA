# Exact commands to run (copy-paste after setting your token)
# Replace ghp_yourPersonalAccessTokenHere with your actual token

# 1) Auth (PAT must have repo,workflow scopes)
$GH = "$env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe"
if (-not (Test-Path $GH)) {
    $GH = "C:\Program Files\GitHub CLI\gh.exe"
}

$env:GH_TOKEN = "ghp_yourPersonalAccessTokenHere"  # ⚠️ REPLACE WITH YOUR ACTUAL TOKEN
$env:GH_TOKEN | & $GH auth login --with-token

# 2) If a run is already queued/running, just watch it:
& $GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA

# 3) If nothing is running, trigger and watch:
& $GH workflow run "iOS TestFlight" --ref main --repo r0bay/Latest-Version-of-AITA
& $GH run watch --exit-status --repo r0bay/Latest-Version-of-AITA

# What to verify in logs (Create keychain & import certificate):
# - subject= printed for /tmp/dist_cert.cer
# - security find-identity -p codesigning lists Apple Distribution
# - No MAC verification failed

# Useful log helpers:
# List recent runs:
# & $GH run list --repo r0bay/Latest-Version-of-AITA

# View last run's logs inline:
# & $GH run view --repo r0bay/Latest-Version-of-AITA --log

# Tail a specific job (replace with job name shown in UI):
# & $GH run view --job "Create keychain & import certificate" --repo r0bay/Latest-Version-of-AITA --log

