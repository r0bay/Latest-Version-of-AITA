@echo off
echo ========================================
echo   Local Flask Server Startup
echo ========================================
echo.

REM Check if .env file exists
if exist .env (
    echo Found .env file, loading environment variables...
    for /f "tokens=1,2 delims==" %%a in (.env) do (
        set "%%a=%%b"
    )
) else (
    echo No .env file found.
    echo.
    echo Please set your Reddit API credentials:
    echo   REDDIT_CLIENT_ID=your_client_id
    echo   REDDIT_CLIENT_SECRET=your_client_secret
    echo.
    echo You can either:
    echo   1. Create a .env file with the above variables
    echo   2. Set them in PowerShell: $env:REDDIT_CLIENT_ID = "value"
    echo.
    pause
    exit /b 1
)

echo.
echo Environment variables loaded.
echo.
echo Your local IP addresses:
echo   Primary: 192.168.0.18
echo   Alternative: 10.5.0.2
echo.
echo Access from your phone: http://192.168.0.18:8080
echo.
echo Starting server...
echo Press Ctrl+C to stop
echo.
echo ========================================
echo.

REM Add firewall rule for port 8080 (if needed)
netsh advfirewall firewall show rule name="Python Flask 8080" >nul 2>&1
if errorlevel 1 (
    echo Adding Windows Firewall rule for port 8080...
    netsh advfirewall firewall add rule name="Python Flask 8080" dir=in action=allow protocol=TCP localport=8080
)

python app.py
