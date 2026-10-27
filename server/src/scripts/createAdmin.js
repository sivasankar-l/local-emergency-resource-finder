const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Admin = require('../models/Admin');

async function createAdminUser(
  name = 'VIT Emergency Administrator',
  email = 'admin@vit.ac.in',
  password = 'Admin@Emergency2026',
  role = 'superadmin'
) {
  const existing = await Admin.findOne({ email: email.toLowerCase() });
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  if (existing) {
    existing.name = name;
    existing.passwordHash = passwordHash;
    existing.role = role;
    await existing.save();
    console.log(`[Admin Setup] Updated existing administrator: ${email}`);
    return existing;
  }

  const newAdmin = await Admin.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role
  });

  console.log(`[Admin Setup] Successfully created administrator: ${email}`);
  return newAdmin;
}

// Standalone execution
if (require.main === module) {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/emergency_resource_finder';
  
  const args = process.argv.slice(2);
  const email = args[0] || process.env.INITIAL_ADMIN_EMAIL || 'admin@vit.ac.in';
  const password = args[1] || process.env.INITIAL_ADMIN_PASSWORD || 'Admin@Emergency2026';
  const name = args[2] || 'VIT Emergency Lead Admin';

  mongoose
    .connect(uri)
    .then(async () => {
      console.log(`[Admin Setup] Connected to MongoDB at ${uri}`);
      await createAdminUser(name, email, password);
      console.log(`--------------------------------------------------`);
      console.log(`Admin Account Credentials for Testing & Demo:`);
      console.log(`Email:    ${email}`);
      console.log(`Password: ${password}`);
      console.log(`--------------------------------------------------`);
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Admin Setup] Failed:', err.message);
      process.exit(1);
    });
}

module.exports = {
  createAdminUser
};
