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
 *       503:
 *         description: Database connection error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MongooseConnectionStatus'
 * components:
 *   schemas:
 *     MongooseConnectionStatus:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [disconnected, connected, connecting, disconnecting]
 *           description: Current status of the MongoDB connection
 *         error:
 *           type: string
 *           description: Error message if connection failed
 *         lastConnected:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last successful connection
 *     CacheResponse:
 *       type: object
 *       properties:
 *         cached:
 *           type: boolean
 *           description: Indicates if the response was served from cache
 *         key:
 *           type: string
 *           description: Cache key used for the request
 *         ttl:
 *           type: number
 *           description: Time-to-live in seconds for the cached response
 */
router.get('/data', authenticate, navController.getNavigationData);

module.exports = router;
