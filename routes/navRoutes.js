const express = require('express');
const router = express.Router();
const navController = require('../controllers/navController');
const validateNavData = require('../middleware/validateNavData');

/**
 * @swagger
 * /nav/data:
 *   get:
 *     summary: Retrieve hierarchical navigation structure
 *     tags: [Navigation]
 *     responses:
 *       200:
 *         description: Navigation data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NavigationData'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/data', validateNavData, navController.getNavData);

module.exports = router;
