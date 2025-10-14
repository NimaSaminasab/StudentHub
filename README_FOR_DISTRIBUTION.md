# 🎓 StudentHub - Student Management System

A complete student management application with booking, payment tracking, and email reminders.

## 📦 What's Included

- ✅ **Student Management** - Add, edit, and search students with profile photos
- ✅ **Booking Calendar** - Schedule and manage class bookings
- ✅ **Payment Tracking** - Track payments and student balances
- ✅ **Email Reminders** - Automatic email notifications before classes
- ✅ **Search Functionality** - Quickly find students and payments
- ✅ **User Authentication** - Secure login with password management
- ✅ **Group Classes** - Support for both private and group lessons

## 🚀 Quick Start

### For Users (Your Friend)

1. **Install Docker Desktop** (one-time setup)
   - Download from: https://www.docker.com/products/docker-desktop/
   - Install and start Docker Desktop

2. **Start the App**
   - Double-click `start-app.bat` (Windows)
   - Wait 2-3 minutes for first-time setup
   - App opens automatically at http://localhost:3000

3. **Login**
   - Username: `admin`
   - Password: `admin123`
   - **Change your password immediately!** (Settings → Change Password)

### For Developers

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev

# Build for production
npm run build

# Build Docker image
docker-compose build

# Run with Docker
docker-compose up -d
```

## 📚 Documentation

- **[Installation Guide](INSTALLATION_GUIDE.md)** - Complete setup instructions
- **[Email Setup](EMAIL_SETUP.md)** - Configure email reminders
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Technical deployment details

## 🔧 Configuration

### Email Reminders (Optional)

1. Go to Settings → Email Reminders
2. Set reminder time (minutes before class)
3. Configure Gmail credentials:
   - Enable 2-factor authentication on Gmail
   - Create App Password: https://myaccount.google.com/apppasswords
   - Use App Password in settings

### Rates

- Set **Private Rate** for one-on-one lessons
- Set **Group Rate** for group classes
- Rates are per 45-minute lesson

## 💾 Data & Backup

### Where is my data stored?

- **Docker**: Data is in Docker volumes (persistent)
- **Local Dev**: Data is in `prisma/dev.db`

### Backup

```bash
# Backup (Docker)
docker run --rm -v studenthub-data:/data -v %cd%:/backup alpine tar czf /backup/backup.tar.gz /data

# Restore (Docker)
docker run --rm -v studenthub-data:/data -v %cd%:/backup alpine tar xzf /backup/backup.tar.gz -C /
```

## 🛠️ Troubleshooting

### App won't start?
- Ensure Docker Desktop is running
- Check port 3000 is available
- Try: `docker-compose down` then `docker-compose up -d`

### Can't login?
- Default: admin / admin123
- Reset: Delete `admin-password.json` and restart

### Lost data?
- Don't run `docker-compose down -v` (removes volumes)
- Regular stop/start preserves data

## 📋 System Requirements

- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: 4 GB minimum
- **Disk**: 2 GB free space
- **Docker**: Docker Desktop (for containerized deployment)
- **Node.js**: v20+ (for development)

## 🔐 Security

- Passwords are stored securely
- All data is local (no cloud)
- HTTPS recommended for production
- Change default password immediately

## 📱 Features in Detail

### Students
- Profile photos with crop tool
- Private and group lesson rates
- Contact information
- Payment history
- Balance tracking

### Bookings
- Visual calendar
- Multiple students per booking
- Attendance tracking
- Email reminders
- Notes and details

### Payments
- Track all payments
- Automatic balance calculation
- Search payment history
- Student payment records

### Settings
- Change admin password
- Configure email reminder timing
- Manage application settings

## 🎨 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite (Prisma ORM)
- **Email**: Nodemailer
- **Deployment**: Docker, Docker Compose
- **Styling**: Custom CSS with glass-morphism

## 📄 License

This is a private application. All rights reserved.

## 🤝 Support

For issues or questions:
1. Check the [Installation Guide](INSTALLATION_GUIDE.md)
2. Review [Troubleshooting](#troubleshooting) section
3. Check Docker logs: `docker-compose logs`
4. Contact the developer

## 🎉 Getting Started

1. Read the [Installation Guide](INSTALLATION_GUIDE.md)
2. Run `start-app.bat`
3. Login and change your password
4. Add your first student
5. Create a booking
6. Track payments

Enjoy using StudentHub! 🚀

