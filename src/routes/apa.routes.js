const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { getAssetConfig, getMetadata } = require('../controllers/apa.controller');

const router = express.Router();

/**
 * @swagger
 * /apa/asset:
 *   get:
 *     summary: Get device-specific asset configurations
 *     tags: [APA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Asset ID
 *       - in: query
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID
 *       - in: query
 *         name: resolution
 *         schema:
 *           type: string
 *         description: Preferred resolution
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *         description: Preferred format
 *     responses:
 *       200:
 *         description: Asset configuration retrieved successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */
router.get('/asset', authenticate, getAssetConfig);

/**
 * @swagger
 * /apa/metadata:
 *   get:
 *     summary: Get content metadata and parameters
 *     tags: [APA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Asset ID
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Preferred language
 *     responses:
 *       200:
 *         description: Metadata retrieved successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */
router.get('/metadata', authenticate, getMetadata);

module.exports = router;
