const express = require('express');
const NavigationController = require('../controllers/navigationController');
const { validate } = require('../middleware/validation');
const rateLimiters = require('../middleware/rateLimit');

const router = express.Router();

// GET /nav/data
router.get(
  '/data',
  rateLimiters.navigation,
  validate('navigationData'),
  NavigationController.getNavigationData
);

module.exports = router;
