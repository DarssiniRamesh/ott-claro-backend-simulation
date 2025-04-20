/**
 * Environment configuration file
 * Loads environment variables from .env file and exports them for use throughout the application
 */

require('dotenv').config();

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // MongoDB configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ott-claro-api',
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1d',
  
  // API configuration
  API_VERSION: process.env.API_VERSION || 'v1',
  
  // Cache configuration
  CACHE_DURATION: parseInt(process.env.CACHE_DURATION || '300'), // 5 minutes in seconds
};
