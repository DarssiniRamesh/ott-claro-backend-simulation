/**
 * User routes
 * Routes for user-related operations
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and session operations
 */

/**
 * @swagger
 * /user/startheaderinfo:
 *   post:
 *     summary: Initialize user session
 *     description: Initialize user session with device and region information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *               - region
 *               - platform
 *               - appVersion
 *             properties:
 *               deviceId:
 *                 type: string
 *                 description: Unique device identifier
 *                 example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *               region:
 *                 type: string
 *                 description: User's geographic region
 *                 example: US
 *               platform:
 *                 type: string
 *                 description: Device platform
 *                 example: iOS
 *               appVersion:
 *                 type: string
 *                 description: Application version
 *                 example: 1.0.0
 *     responses:
 *       200:
 *         description: Session initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserHeaderInfo'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
router.post('/startheaderinfo', authenticate, userController.startHeaderInfo);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     description: Get current user's profile information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
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
router.get('/profile', authenticate, userController.getCurrentUser);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update current user's profile information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/avatar.jpg
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
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
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @swagger
 * /user/password:
 *   put:
 *     summary: Change password
 *     description: Change current user's password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: CurrentPass123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPass123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized or incorrect current password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
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
router.put('/password', authenticate, userController.changePassword);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidate user's refresh token
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
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
router.post('/logout', authenticate, userController.logoutUser);

module.exports = router;
