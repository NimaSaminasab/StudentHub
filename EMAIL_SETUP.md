# Email Reminder Setup

## 📧 Email Configuration

Your app now sends automatic email reminders to students 2 minutes before their class starts!

### Setup Instructions:

1. **Add email configuration to your `.env` file:**

```env
# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### For Gmail:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated password
3. **Update `.env` file:**
   - `SMTP_USER` = your Gmail address
   - `SMTP_PASS` = the app password (16 characters)

### For Other Email Services:

**Outlook/Hotmail:**
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-password"
```

**Yahoo:**
```env
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT="587"
SMTP_USER="your-email@yahoo.com"
SMTP_PASS="your-app-password"
```

### Testing Without Real Email:

For testing, you can use **Ethereal Email** (fake SMTP):
1. Go to https://ethereal.email/
2. Click "Create Ethereal Account"
3. Copy the SMTP credentials to your `.env` file
4. Emails will be captured at https://ethereal.email/messages

## 🚀 How It Works:

1. **Scheduler runs every minute** checking for upcoming classes
2. **2 minutes before class** starts, an email is sent to the student
3. **Email includes:**
   - Student's name
   - Class title
   - Start time
4. **Automatic** - no manual action needed

## 📋 Example Email:

```
Subject: Reminder: Class starting in 2 minutes - Grammar Learning

Hi John Doe,

This is a friendly reminder that your class is starting in 2 minutes!

Grammar Learning
Start Time: 10/10/2025, 2:00:00 PM

Please be ready to join your lesson.
```

## ✅ Status:

- ✅ Email service configured
- ✅ Scheduler running (checks every minute)
- ✅ Automatic reminders 2 minutes before class
- ⚠️ **Action Required:** Configure SMTP settings in `.env` file

## 🔧 Troubleshooting:

If emails aren't sending:
1. Check `.env` file has correct SMTP settings
2. Check terminal for "Email sent:" logs
3. Verify student has valid email address
4. Test with Ethereal Email first

App-password : botx dgpb imlu wtbs