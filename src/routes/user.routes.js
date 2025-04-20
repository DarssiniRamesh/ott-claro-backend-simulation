/**
 * User routes
 * Routes for user operations
 */

const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const { UserSessionRequest } = require('../types/api.types');
const userController = require('../controllers/user.controller');


const router = express.Router();

/**
 * @swagger
 * /user/startheaderinfo:
 *   post:
 *     summary: Initialize user session with device and region information
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
 *               region:
 *                 type: string
 *               platform:
 *                 type: string
 *               appVersion:
 *                 type: string
 *     responses:
 *       200:
 *         description: User session initialized successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */
router.post('/startheaderinfo', authenticate, validateRequest(UserSessionRequest), userController.startHeaderInfo);


/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management API
 */

/**
 * @swagger
 * /user/startheaderinfo:
 *   get:
 *     summary: Get user header information
 *     description: Retrieve header information for the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User header information
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
 *                     headerInfo:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                           example: 60d21b4667d0d8992e610c85
 *                         displayName:
 *                           type: string
 *                           example: John Doe
 *                         avatar:
 *                           type: string
 *                           example: https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y
 *                         notifications:
 *                           type: integer
 *                           example: 5
 *       401:
 *         description: Unauthorized
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
router.get('/startheaderinfo', authenticate, userController.getStartHeaderInfo);

module.exports = router;
