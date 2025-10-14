@echo off
echo ========================================
echo   StudentHub - Stopping Application
echo ========================================
echo.

docker-compose down

if errorlevel 1 (
    echo.
    echo ERROR: Failed to stop the application.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   StudentHub has been stopped!
echo ========================================
echo.
echo Your data is safe and will be available
echo when you start the app again.
echo.
echo To start again, run: start-app.bat
echo.
echo Press any key to close this window...
pause >nul

