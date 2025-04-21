const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * /user/startheaderinfo:
 *   get:
 *     summary: Initialize user session with device and region information
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: deviceInfo
 *         required: true
 *         schema:
 *           type: string
 *         description: Device information in JSON format
 *       - in: query
 *         name: region
 *         required: true
 *         schema:
 *           type: string
 *         description: Geographic region code
 *     responses:
 *       200:
 *         description: Session initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/startheaderinfo', userController.startHeaderInfo);

module.exports = router;
