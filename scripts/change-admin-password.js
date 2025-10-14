const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function changeAdminPassword() {
  console.log('🔐 Change Admin Password\n');
  
  try {
    // Get current password
    const currentPassword = await askQuestion('Enter current password: ');
    
    // Verify current password
    const passwordFile = path.join(process.cwd(), 'admin-password.json');
    if (!fs.existsSync(passwordFile)) {
      console.log('❌ No password file found. Run setup-admin-password.js first.');
      rl.close();
      return;
    }
    
    const data = JSON.parse(fs.readFileSync(passwordFile, 'utf-8'));
    const currentHash = data.passwordHash;
    
    if (!currentHash) {
      console.log('❌ Invalid password file format. Run setup-admin-password.js first.');
      rl.close();
      return;
    }
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, currentHash);
    if (!isValid) {
      console.log('❌ Invalid current password.');
      rl.close();
      return;
    }
    
    // Get new password
    const newPassword = await askQuestion('Enter new password: ');
    const confirmPassword = await askQuestion('Confirm new password: ');
    
    if (newPassword !== confirmPassword) {
      console.log('❌ Passwords do not match.');
      rl.close();
      return;
    }
    
    if (newPassword.length < 6) {
      console.log('❌ Password must be at least 6 characters long.');
      rl.close();
      return;
    }
    
    // Hash new password
    console.log('🔒 Hashing new password...');
    const newHash = await bcrypt.hash(newPassword, 12);
    
    // Update password file
    const newPasswordData = {
      passwordHash: newHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      note: "This file contains an encrypted password hash. The original password is not stored."
    };
    
    fs.writeFileSync(passwordFile, JSON.stringify(newPasswordData, null, 2));
    
    console.log('✅ Password changed successfully!');
    console.log('🔒 Your password is now encrypted and secure');
    
  } catch (error) {
    console.error('❌ Error changing password:', error.message);
  } finally {
    rl.close();
  }
}

// Run the password change
changeAdminPassword().catch(error => {
  console.error('❌ Password change failed:', error);
  process.exit(1);
});
