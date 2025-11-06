# PowerShell script to start local Flask server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Local Flask Server Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Load .env file if it exists
if (Test-Path .env) {
    Write-Host "Loading environment variables from .env file..." -ForegroundColor Green
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
} else {
    Write-Host "No .env file found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please create a .env file with:" -ForegroundColor Yellow
    Write-Host "  REDDIT_CLIENT_ID=your_client_id" -ForegroundColor Yellow
    Write-Host "  REDDIT_CLIENT_SECRET=your_client_secret" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

# Check if variables are set
if (-not $env:REDDIT_CLIENT_ID -or -not $env:REDDIT_CLIENT_SECRET) {
    Write-Host "ERROR: REDDIT_CLIENT_ID or REDDIT_CLIENT_SECRET not set!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check your .env file" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "Environment variables loaded successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Your local IP addresses:" -ForegroundColor Cyan
Write-Host "  Primary: 192.168.0.18" -ForegroundColor White
Write-Host "  Alternative: 10.5.0.2" -ForegroundColor White
Write-Host ""
Write-Host "Access from your phone: http://192.168.0.18:8080" -ForegroundColor Green
Write-Host ""
Write-Host "Starting server..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Try to add firewall rule (may require admin)
try {
    $rule = Get-NetFirewallRule -Name "Python Flask 8080" -ErrorAction SilentlyContinue
    if (-not $rule) {
        Write-Host "Note: If connection fails, you may need to allow port 8080 in Windows Firewall" -ForegroundColor Yellow
        Write-Host "Run this as Administrator: netsh advfirewall firewall add rule name='Python Flask 8080' dir=in action=allow protocol=TCP localport=8080" -ForegroundColor Yellow
        Write-Host ""
    }
} catch {
    # Ignore firewall errors
}

# Start the server
python app.py


