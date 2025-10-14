@echo off
echo ========================================
echo   StudentHub - Starting Application
echo ========================================
echo.
echo Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not running!
    echo.
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    pause
    exit /b 1
)

echo Docker is ready!
echo.
echo Starting StudentHub...
echo This may take 2-3 minutes on first run...
echo.

docker-compose up -d

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start the application.
    echo Please make sure Docker Desktop is running.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   StudentHub is starting!
echo ========================================
echo.
echo Waiting for the app to be ready...
timeout /t 10 /nobreak >nul

echo.
echo Opening StudentHub in your browser...
echo.
echo If it doesn't open automatically, go to:
echo http://localhost:3000
echo.
echo Login credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo To stop the app, run: stop-app.bat
echo.

start http://localhost:3000

echo Press any key to close this window...
pause >nul

