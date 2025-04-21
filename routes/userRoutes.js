const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * /user/startheaderinfo:
 *   get:
 *     summary: Initialize user session with device and region information
 *     description: Returns session information along with geolocation and time details based on the client's IP address (supports both IPv4 and IPv6)
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: authpn
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication parameter name (must be 'tataelxsi')
 *         example: tataelxsi
 *       - in: query
 *         name: authpt
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication parameter token (must be 'vofee7ohhecai')
 *         example: vofee7ohhecai
 *     responses:
 *       200:
 *         description: Session initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session_stringvalue:
 *                   type: string
 *                   description: Unique session identifier (UUID v4)
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 session_parametername:
 *                   type: string
 *                   description: Session parameter name (always 'HKS')
 *                   example: "HKS"
 *                 region:
 *                   type: string
 *                   description: User's region code based on IP geolocation (two-letter ISO 3166-1 country code)
 *                   example: "US"
 *                 timezone:
 *                   type: string
 *                   description: User's timezone based on IP geolocation (IANA timezone identifier)
 *                   example: "America/New_York"
 *                 date:
 *                   type: string
 *                   description: Current date in user's timezone (YYYY-MM-DD)
 *                   example: "2024-01-20"
 *                 time:
 *                   type: string
 *                   description: Current time in user's timezone (HH:mm:ss)
 *                   example: "14:30:00"
 *                 utc:
 *                   type: string
 *                   description: UTC timestamp in ISO 8601 format
 *                   example: "2024-01-20T19:30:00Z"
 *                 local_time:
 *                   type: string
 *                   description: Full local time with timezone offset
 *                   example: "2024-01-20 14:30:00 -0500"
 *       400:
 *         description: Invalid request - Missing or invalid parameters
 *       401:
 *         description: Unauthorized - Invalid authentication credentials
 *       500:
 *         description: Internal server error - Could occur due to geolocation service failure or timezone processing errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/startheaderinfo', userController.startHeaderInfo);

module.exports = router;
