/**
 * API routes index
 * Combines all route files into a single router
 */

const express = require('express');
const router = express.Router();

// Import route files
const itemRoutes = require('./item.routes');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const navRoutes = require('./nav.routes');
const apaRoutes = require('./apa.routes');

// Use route files
router.use('/items', itemRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/nav', navRoutes);
router.use('/apa', apaRoutes);

// API health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date()
  });
});

module.exports = router;
