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
  const maxRetries = 3;
  let retries = 0;
  let connected = false;
  
  while (retries < maxRetries && !connected) {
    try {
      // Connect to MongoDB
      await mongoose.connect(config.MONGODB_URI, {
        // Options are automatically handled in newer versions of Mongoose
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
      });
      
      connected = true;
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
      retries++;
      console.error(`Error connecting to MongoDB (attempt ${retries}/${maxRetries}): ${error.message}`);
      
      if (error.code === 'ECONNREFUSED') {
        console.error(`Could not connect to MongoDB at ${config.MONGODB_URI}. Please ensure MongoDB is running.`);
      }
      
      if (retries < maxRetries) {
        console.log(`Retrying connection in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds before retrying
      } else {
        console.error('Failed to connect to MongoDB after multiple attempts. Starting server without database connection.');
        // Return null instead of exiting to allow the server to start without DB
        return null;
      }
    }
  }
};

module.exports = connectDB;
