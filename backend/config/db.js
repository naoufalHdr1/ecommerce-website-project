// config/db.js

import mongoose from 'mongoose';

class DBClient {
  constructor() {
    this.connection = null;
  }

  /**
   * Check if the MongoDB connection is alive
   * @returns {boolean} - true if connected, false otherwise
   */
  isAlive() {
    return this.connection ? true : false;
  }

  async connect(uri) {
    try {
      this.connection = await mongoose.connect(uri);
      console.log(` * MongoDB Connected: ${this.connection.connection.host}`);
    } catch (err) {
      console.error(`Error connecting to database ${err.message}`);
      process.exit(1); // Exit with failure
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log(' * MongoDB Disconnected');
    } catch (err) {
      console.error(`Error disconnecting from database: ${err.message}`);
    }
  }

  async dropDatabase() {
    try {
      if (this.isAlive()) {
        await this.connection.connection.db.dropDatabase();
        console.log(' * Database dropped');
      }
    } catch (err) {
      console.error(`Error dropping database: ${err.message}`);
    }
  }
}

// Create an instance of DBClient and export it
const dbClient = new DBClient();
export default dbClient;
