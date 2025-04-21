/**
 * Navigation routes
 * Routes for navigation-related operations
 */

const express = require('express');
const router = express.Router();
const navController = require('../controllers/nav.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Navigation
 *   description: Navigation structure operations
 */

/**
 * @swagger
 * /nav/data:
 *   get:
 *     summary: Get navigation structure
 *     description: Retrieve hierarchical navigation structure for the application
 *     tags: [Navigation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Navigation data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     navigation:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: Unique identifier for the navigation item
 *                             example: home
 *                           title:
 *                             type: string
 *                             description: Display title for the navigation item
 *                             example: Home
 *                           path:
 *                             type: string
 *                             description: URL path for the navigation item
 *                             example: /
 *                           icon:
 *                             type: string
 *                             description: Icon identifier for the navigation item
 *                             example: home
 *                           children:
 *                             type: array
 *                             description: Nested navigation items
 *                             items:
 *                               $ref: '#/components/schemas/NavigationItem'
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/data', authenticate, navController.getNavigationData);

module.exports = router;
