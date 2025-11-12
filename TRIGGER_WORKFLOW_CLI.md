# Trigger GitHub Actions Workflow from CLI

## Step 1: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `GitHub Actions CLI`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again!)
   - It starts with `ghp_`

## Step 2: Authenticate GitHub CLI

Open a **new PowerShell window** (to get updated PATH), then run:

```powershell
# Replace with your actual token
$env:GH_TOKEN = "ghp_yourPersonalAccessTokenHere"
$env:GH_TOKEN | gh auth login --with-token
```

Or set it permanently in your PowerShell profile:

```powershell
# Add to your PowerShell profile
notepad $PROFILE
# Add this line (replace with your token):
$env:GH_TOKEN = "ghp_yourPersonalAccessTokenHere"
```

## Step 3: Verify Authentication

```powershell
gh auth status
```

You should see: `✓ Logged in to github.com as <your-username>`

## Step 4: Navigate to Your Repository

```powershell
cd "C:\Users\rrwil\Desktop\AITA Project - Copy"
```

## Step 5: Run the Workflow

```powershell
gh workflow run "iOS TestFlight" --ref main
```

## Step 6: Watch the Workflow

```powershell
gh run watch --exit-status
```

This will:
- Stream the logs in real-time
- Exit with status 0 if successful, non-zero if failed
- Show you the build progress

## Alternative: List and View Workflows

```powershell
# List all workflows
gh workflow list

# View recent runs
gh run list --workflow="iOS TestFlight"

# View a specific run
gh run view <run-id>

# View logs for a specific run
gh run view <run-id> --log
```

## Troubleshooting

### "gh: command not found"
- Close and reopen PowerShell (PATH needs to refresh)
- Or use full path: `C:\Program Files\GitHub CLI\gh.exe`

### "Authentication failed"
- Verify your token has `repo` and `workflow` scopes
- Make sure you copied the entire token (starts with `ghp_`)

### "Workflow not found"
- Check the workflow name matches exactly: `iOS TestFlight`
- List workflows: `gh workflow list`

## Quick One-Liner (After Setup)

Once authenticated, you can trigger and watch in one command:

```powershell
gh workflow run "iOS TestFlight" --ref main; gh run watch --exit-status
```

