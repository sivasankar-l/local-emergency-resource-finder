const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = require('./app');
const { connectDB } = require('./config/database');
const Admin = require('./models/Admin');
const { createAdminUser } = require('./scripts/createAdmin');
const { seedIfEmpty } = require('./scripts/seedResources');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    // Ensure at least one initial administrator exists for out-of-the-box demo
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('[Server] No admin found. Bootstrapping default demo administrator...');
      await createAdminUser(
        'VIT Emergency Lead Admin',
        'admin@vit.ac.in',
        'Admin@Emergency2026',
        'superadmin'
      );
    }

    // Ensure demo resources are populated if database has 0 items
    await seedIfEmpty();

    const server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` Local Emergency Resource Finder - Backend API Server`);
      console.log(` VIT Innovative Project (IIP)`);
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(` Health check:   http://localhost:${PORT}/api/health`);
      console.log(` Resources API:  http://localhost:${PORT}/api/resources`);
      console.log(`=======================================================`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });
  } catch (error) {
    console.error('[Server] Fatal startup error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
