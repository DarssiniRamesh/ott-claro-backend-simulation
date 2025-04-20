const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { getNavigationData } = require('../controllers/nav.controller');

const router = express.Router();

/**
 * @swagger
 * /nav/data:
 *   get:
 *     summary: Get hierarchical navigation structure
 *     tags: [Navigation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Navigation data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/data', authenticate, getNavigationData);

module.exports = router;
