/**
 * MongoDB connection setup using Mongoose
 * Establishes a connection to MongoDB using the connection string from environment variables
 */

const mongoose = require('mongoose');
const config = require('../config/env.config');

/**
 * Connect to MongoDB using Mongoose
 * @returns {Promise} Mongoose connection promise
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI, {
      // Options are automatically handled in newer versions of Mongoose
    });
    
    console.log('MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
