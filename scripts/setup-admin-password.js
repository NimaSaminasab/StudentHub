const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function setupAdminPassword() {
  console.log('🔐 Setting up encrypted admin password...\n');
  
  // Default password (you can change this)
  const defaultPassword = 'admin12345';
  
  console.log(`Using password: ${defaultPassword}`);
  console.log('Hashing password...');
  
  // Hash the password with salt rounds 12
  const hashedPassword = await bcrypt.hash(defaultPassword, 12);
  
  // Create the encrypted password file
  const passwordData = {
    passwordHash: hashedPassword,
    createdAt: new Date().toISOString(),
    note: "This file contains an encrypted password hash. The original password is not stored."
  };
  
  const passwordFile = path.join(process.cwd(), 'admin-password.json');
  
  try {
    fs.writeFileSync(passwordFile, JSON.stringify(passwordData, null, 2));
    console.log('✅ Password file created successfully!');
    console.log(`📁 Location: ${passwordFile}`);
    console.log('🔒 Password is now encrypted and secure');
    console.log('\n⚠️  IMPORTANT: Remember your password: admin12345');
    console.log('   You can change it by modifying this script and running it again.');
  } catch (error) {
    console.error('❌ Error creating password file:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupAdminPassword().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
