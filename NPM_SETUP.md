# StudentHub - NPM Setup Guide

You now have an alternative way to run StudentHub without Docker containers!

## Quick Start (NPM Version)

1. **Start the application:**
   ```bash
   start-app-npm.bat
   ```

2. **Stop the application:**
   ```bash
   stop-app-npm.bat
   ```

## What's Different?

- **No Docker required** - Runs directly with Node.js and npm
- **Faster startup** - No container building or pulling
- **Easier debugging** - Direct access to logs and processes
- **Better for development** - Hot reloading and easier file access

## Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)

## First Time Setup

1. Run `start-app-npm.bat` - it will automatically:
   - Check for Node.js installation
   - Create `.env` file from template
   - Install dependencies
   - Set up the database
   - Start the development server

2. The app will open at: http://localhost:3000

## Login Credentials

- **Username:** admin
- **Password:** admin123

## Environment Configuration

The `.env` file will be created automatically. You can edit it to configure:
- Database settings
- Email settings (for reminders)

## Troubleshooting

- If port 3000 is busy, the scripts will help stop existing processes
- Check that Node.js is installed: `node --version`
- If database issues occur, delete `prisma/dev.db` and restart

## File Structure

- `start-app-npm.bat` - Start the application with npm
- `stop-app-npm.bat` - Stop the application
- `start-app.bat` - Original Docker version (if you want to switch back)
- `stop-app.bat` - Stop Docker version
