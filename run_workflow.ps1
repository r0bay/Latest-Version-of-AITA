# Run GitHub Actions Workflow
# Make sure you've updated P12_PASSWORD secret in GitHub UI first!

# Try to find GitHub CLI
$ghPath = $null
$possiblePaths = @(
    "$env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe",
    "$env:ProgramFiles\GitHub CLI\gh.exe",
    "$env:ProgramFiles(x86)\GitHub CLI\gh.exe"
)

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $ghPath = $path
        break
    }
}

if (-not $ghPath) {
    # Try 'gh' command (if in PATH)
    $ghPath = "gh"
}

Write-Host "Using GitHub CLI at: $ghPath"
Write-Host ""

# Check authentication
Write-Host "Checking authentication..."
& $ghPath auth status
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Not authenticated. Run:" -ForegroundColor Red
    Write-Host '  $env:GH_TOKEN = "ghp_yourTokenHere"' -ForegroundColor Yellow
    Write-Host '  $env:GH_TOKEN | gh auth login --with-token' -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Triggering workflow: iOS TestFlight" -ForegroundColor Green
& $ghPath workflow run "iOS TestFlight" --ref main --repo r0bay/Latest-Version-of-AITA

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Watching workflow run..." -ForegroundColor Green
    & $ghPath run watch --exit-status --repo r0bay/Latest-Version-of-AITA
} else {
    Write-Host ""
    Write-Host "Failed to trigger workflow. Check authentication and workflow name." -ForegroundColor Red
    exit 1
}


