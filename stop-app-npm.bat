@echo off
echo ========================================
echo   StudentHub - Stopping NPM Application
echo ========================================
echo.

echo Stopping Node.js processes...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo Stopping process %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Checking for any remaining Node.js processes...
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq node.exe" /FO CSV ^| find /V "INFO:"') do (
    echo Found Node.js process %%a, stopping...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ========================================
echo   StudentHub has been stopped!
echo ========================================
echo.
echo Your data is safe and will be available
echo when you start the app again.
echo.
echo To start again, run: start-app-npm.bat
echo.
echo Press any key to close this window...
pause >nul
