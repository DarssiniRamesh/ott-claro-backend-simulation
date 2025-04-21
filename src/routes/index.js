const express = require('express');
const userRoutes = require('./user.routes');
const navRoutes = require('./nav.routes');
const apaRoutes = require('./apa.routes');
const { errorHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Mount routes
router.use('/user', userRoutes);
router.use('/nav', navRoutes);
router.use('/apa', apaRoutes);

// Error handling middleware
router.use(errorHandler);

module.exports = router;
