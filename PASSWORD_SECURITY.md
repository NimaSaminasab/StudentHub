# Password Security Guide

## 🔐 Encrypted Password System

Your admin password is now stored securely using bcrypt encryption instead of plain text.

## 📁 Files

- `admin-password.json` - Contains encrypted password hash (DO NOT share this file)
- `src/lib/passwordUtils.ts` - Password encryption utilities
- `scripts/setup-admin-password.js` - Initial password setup
- `scripts/change-admin-password.js` - Change existing password

## 🚀 Quick Start

### Current Login Credentials
- **Username:** `admin`
- **Password:** `admin12345`

### First Time Setup
The encrypted password is already set up. If you need to reset it:

```bash
node scripts/setup-admin-password.js
```

### Change Password
To change your admin password:

```bash
node scripts/change-admin-password.js
```

## 🔒 Security Features

### ✅ What's Secure Now
- **Bcrypt Hashing**: Passwords are hashed with salt rounds 12
- **No Plain Text**: Original passwords are never stored
- **Secure Comparison**: Uses bcrypt.compare() for verification
- **Fallback Protection**: Warns if plain text passwords are detected

### 🔧 Technical Details
- **Algorithm**: bcrypt with 12 salt rounds
- **Hash Format**: `$2b$12$...` (bcrypt standard)
- **Verification**: Asynchronous password comparison
- **Backward Compatibility**: Supports old plain text format with warnings

## 📝 Password File Format

```json
{
  "passwordHash": "$2b$12$Qv9MPTsH.bbNmQaqFRfioeujeCxcwP6LJ2jbSa6HfeKpTxnzGDcNi",
  "createdAt": "2025-10-14T06:14:37.176Z",
  "note": "This file contains an encrypted password hash. The original password is not stored."
}
```

## ⚠️ Important Notes

1. **Keep `admin-password.json` private** - Never commit this file to version control
2. **Remember your password** - The original password is not stored anywhere
3. **Regular updates** - Consider changing passwords periodically
4. **Backup safely** - If you lose the password file, you'll need to run the setup script again

## 🛠️ Troubleshooting

### "Authentication system not configured"
- Run: `node scripts/setup-admin-password.js`

### "Invalid username or password"
- Check your username is exactly `admin`
- Verify your password is correct
- Try changing password with: `node scripts/change-admin-password.js`

### "Using plain text password"
- Your system is using the old insecure method
- Run: `node scripts/setup-admin-password.js` to upgrade

## 🔄 Migration from Plain Text

If you had a plain text password before:

1. The system will detect it automatically
2. You'll see a warning in the logs
3. Run `node scripts/setup-admin-password.js` to upgrade
4. Your login will continue to work during migration

## 📚 Advanced Usage

### Generate Secure Password
```javascript
import { generateSecurePassword } from '@/lib/passwordUtils';
const newPassword = generateSecurePassword(16); // 16 characters
```

### Hash Password Programmatically
```javascript
import { hashPassword } from '@/lib/passwordUtils';
const hash = await hashPassword('your-password');
```

### Verify Password Programmatically
```javascript
import { verifyPassword } from '@/lib/passwordUtils';
const isValid = await verifyPassword('input-password', 'stored-hash');
```
