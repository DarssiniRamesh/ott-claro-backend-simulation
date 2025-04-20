/**
 * Main server file for the OTT Claro Backend Simulation API
 * This file initializes Express, connects to MongoDB, sets up middleware, and starts the server
 */

// Import required packages
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');

// Import configuration
const config = require('./config/env.config');

// Import database connection
const connectDB = require('./db/mongoose');

// Import routes
const routes = require('./routes');

// Import Swagger documentation
const swaggerSetup = require('./swagger/swagger');

// Import error handling middleware
const errorHandler = require('./middleware/error.middleware');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Set up middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());
require('./config/passport.config');

// Set up Swagger documentation
swaggerSetup(app);

// Set up routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to OTT Claro Backend Simulation API',
    documentation: '/api-docs'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
