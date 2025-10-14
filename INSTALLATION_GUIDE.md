# StudentHub - Installation Guide for Your Friend

## 📦 What You Need to Send

Send your friend these files in a ZIP:
1. The entire project folder (or just the Docker files if you build first)
2. This installation guide

## 🚀 Quick Start (For Your Friend)

### Step 1: Install Docker Desktop

1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Install it (it's free!)
3. Start Docker Desktop
4. Wait for it to say "Docker is running"

### Step 2: Extract the Files

1. Extract the ZIP file you received
2. Open the folder in File Explorer

### Step 3: Start the App

**Windows:**
1. Double-click `start-app.bat`
2. Wait 2-3 minutes for first-time setup
3. The app will open automatically in your browser

**Or manually:**
1. Open Command Prompt in the folder (Shift + Right-click → "Open PowerShell window here")
2. Run: `docker-compose up -d`
3. Wait 2-3 minutes
4. Open browser and go to: http://localhost:3000

### Step 4: Login

- **Username**: `admin`
- **Password**: `admin123`

**⚠️ Important**: Change your password immediately!
- Go to Settings → Change Password

## 📱 Using the App

The app will be available at: **http://localhost:3000**

You can:
- ✅ Manage students (with photos!)
- ✅ Schedule bookings
- ✅ Track payments
- ✅ Search everything
- ✅ Set up email reminders (optional)

## 🛑 Stopping the App

**Windows:**
- Double-click `stop-app.bat`

**Or manually:**
- Run: `docker-compose down`

## 🔄 Updating the App

If you receive an updated version:
1. Stop the app
2. Replace the files
3. Run: `docker-compose up -d --build`

## 💾 Backup Your Data

Your data is stored in Docker volumes. To backup:

```bash
# Backup
docker run --rm -v studenthub-data:/data -v %cd%:/backup alpine tar czf /backup/studenthub-backup.tar.gz /data

# Restore
docker run --rm -v studenthub-data:/data -v %cd%:/backup alpine tar xzf /backup/studenthub-backup.tar.gz -C /
```

## 🆘 Troubleshooting

### App won't start?
- Make sure Docker Desktop is running
- Check if port 3000 is available (close other apps using it)
- Try: `docker-compose down` then `docker-compose up -d`

### Can't access the app?
- Open http://localhost:3000 (not 127.0.0.1)
- Check Docker Desktop → Containers (should show "studenthub-app" running)

### Forgot password?
1. Stop the app
2. Run: `docker-compose down -v` (⚠️ This deletes all data!)
3. Start again with `docker-compose up -d`
4. Login with default password: `admin123`

### Lost data?
- Data is stored in Docker volumes
- As long as you don't run `docker-compose down -v`, your data is safe
- Regular stop/start keeps your data

## 📧 Email Setup (Optional)

To enable email reminders:

1. Go to Settings → Email Reminders
2. Set how many minutes before class to send reminders
3. For Gmail:
   - Enable 2-factor authentication
   - Create an "App Password": https://myaccount.google.com/apppasswords
   - Use that password in your email settings

## 💡 Tips

- **Bookmark** http://localhost:3000 for easy access
- **Backup regularly** using the backup command above
- **Change the default password** immediately after first login
- **Keep Docker Desktop running** when using the app

## 🖥️ System Requirements

- Windows 10/11 (64-bit)
- 4 GB RAM minimum
- 2 GB free disk space
- Internet connection (only for initial Docker install)

## 📞 Support

If you have issues:
1. Check Docker Desktop is running
2. Try restarting Docker Desktop
3. Run: `docker-compose logs` to see error messages
4. Contact the person who sent you this app

## 🎉 Enjoy!

Your StudentHub app is now ready to use. All data is stored locally and privately on your computer.

