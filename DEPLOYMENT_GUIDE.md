# StudentHub - Standalone Desktop App Deployment Guide

## Overview
This guide will help you create a standalone desktop application that your friend can install and use without any setup.

## What Changed
- **Database**: Switched from MySQL to SQLite (embedded database)
- **Packaging**: Using Electron to create a desktop app
- **Distribution**: Single `.exe` file for Windows

## Steps to Create Standalone App

### 1. Build the Application

```bash
# Install dependencies (if not already done)
npm install

# Generate Prisma client for SQLite
npx prisma generate

# Create the SQLite database
npx prisma db push

# Build the Next.js app for production
npm run build

# Package the Electron app
npm run electron:build
```

### 2. Find Your Distributable

After running `npm run electron:build`, you'll find the installer in:
```
dist/StudentHub Setup 1.0.0.exe
```

### 3. Send to Your Friend

1. Send the `.exe` file to your friend
2. They double-click to install
3. The app creates its own database automatically
4. They can start using it immediately!

## Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

Your friend can change the password in Settings → Change Password

## Features Included

✅ Student Management (with photos)
✅ Booking Calendar
✅ Payment Tracking
✅ Email Reminders (requires email setup)
✅ Search Functionality
✅ User Authentication
✅ All data stored locally in SQLite

## Email Setup (Optional)

If your friend wants email reminders:

1. Open Settings → Email Reminders
2. Configure reminder time
3. Set up Gmail credentials in the app settings

## Data Location

All data is stored in:
```
%APPDATA%/StudentHub/
├── dev.db (SQLite database)
├── uploads/ (student photos)
├── admin-password.json
└── email-settings.json
```

## Backup

To backup data, copy the entire `%APPDATA%/StudentHub/` folder.

## Troubleshooting

**App won't start?**
- Make sure Windows Defender isn't blocking it
- Right-click → Run as Administrator

**Lost data?**
- Check `%APPDATA%/StudentHub/` for backup

**Forgot password?**
- Delete `admin-password.json` to reset to `admin123`

## System Requirements

- Windows 10 or later
- 200 MB free disk space
- No internet required (except for email reminders)

## Support

For issues, check the console logs in:
```
%APPDATA%/StudentHub/logs/
```

