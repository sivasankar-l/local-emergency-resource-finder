const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/emergency_resource_finder';
  
  try {
    // Attempt standard connection first with 3 second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] Connected to MongoDB at ${mongoose.connection.host}:${mongoose.connection.port}`);
    return mongoose.connection;
  } catch (error) {
    console.warn(`[Database] Direct MongoDB connection to ${uri} failed: ${error.message}`);
    console.log(`[Database] Attempting in-memory MongoDB fallback for instant zero-config setup...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongodInstance.getUri();
      
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Connected to In-Memory MongoDB at ${inMemoryUri}`);
      
      // Auto-seed in-memory database if empty
      const { seedIfEmpty } = require('../scripts/seedResources');
      await seedIfEmpty();

      return mongoose.connection;
    } catch (memError) {
      console.error(`[Database] In-memory MongoDB failed to start:`, memError.message);
      throw error;
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
    console.log('[Database] Disconnected from MongoDB');
  } catch (error) {
    console.error('[Database] Disconnect error:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
