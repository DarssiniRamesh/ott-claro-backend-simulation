const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./user.routes');
const navRoutes = require('./nav.routes');
const apaRoutes = require('./apa.routes');

// Configure routes with their respective path prefixes
router.use('/user', userRoutes);  // Handles /user/startheaderinfo endpoint
router.use('/nav', navRoutes);    // Handles /nav/data endpoint
router.use('/apa', apaRoutes);    // Handles /apa/asset and /apa/metadata endpoints

module.exports = router;