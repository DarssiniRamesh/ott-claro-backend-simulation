/**
 * API routes index
 * Combines all route files into a single router
 */

const express = require('express');
const router = express.Router();

// Import route files
const itemRoutes = require('./item.routes');
const authRoutes = require('./auth.routes');

// Use route files
router.use('/items', itemRoutes);
router.use('/auth', authRoutes);

// API health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date()
  });
});

module.exports = router;
