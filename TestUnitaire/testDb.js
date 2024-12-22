const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

const connectTestDb = async () => {
  if (!mongoServer) {
    // Initialize MongoMemoryServer if it's not already initialized
    mongoServer = await MongoMemoryServer.create();
  }

  const uri = mongoServer.getUri(); // Get the URI for the in-memory database

  if (!uri) {
    throw new Error("MongoDB Memory Server URI is undefined.");
  }

  // Ensure the database connection
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

const closeTestDb = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

const clearTestDb = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

module.exports = {
  connectTestDb,
  closeTestDb,
  clearTestDb,
};
