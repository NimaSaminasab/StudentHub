@echo off
echo ========================================
echo   StudentHub - Starting with NPM
echo ========================================
echo.

echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js is ready!
echo.

echo Checking if .env file exists...
if not exist .env (
    echo Creating .env file from template...
    copy env.example .env
    echo.
    echo IMPORTANT: Please edit .env file to configure your settings
    echo.
)

echo Checking if admin password is configured...
if not exist admin-password.json (
    echo Setting up encrypted admin password...
    node scripts/setup-admin-password.js
    echo.
)

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies.
    echo.
    pause
    exit /b 1
)

echo.
echo Setting up database...
call npx prisma generate
call npx prisma db push
if errorlevel 1 (
    echo.
    echo ERROR: Failed to setup database.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   StudentHub is starting!
echo ========================================
echo.
echo Starting development server...
echo This will open http://localhost:3000/login
echo.
echo Login credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo To stop the app, press Ctrl+C or run: stop-app-npm.bat
echo.

start http://localhost:3000/login
call npm run dev
