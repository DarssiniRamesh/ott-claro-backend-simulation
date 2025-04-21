const express = require('express');
const router = express.Router();
const apaController = require('../controllers/apaController');

/**
 * @swagger
 * /apa/asset:
 *   get:
 *     summary: Get device-specific asset configurations
 *     tags: [Asset]
 *     parameters:
 *       - in: query
 *         name: authpn
 *         required: true
 *         schema:
 *           type: string
 *           enum: [tataelxsi]
 *         description: Authentication parameter name
 *       - in: query
 *         name: authpt
 *         required: true
 *         schema:
 *           type: string
 *           enum: [vofee7ohhecai]
 *         description: Authentication parameter token
 *       - in: query
 *         name: device_category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [stb]
 *         description: Device category
 *       - in: query
 *         name: device_type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ptv, ott]
 *         description: Device type
 *       - in: query
 *         name: device_model
 *         required: true
 *         schema:
 *           type: string
 *           enum: [androidTV]
 *         description: Device model
 *       - in: query
 *         name: device_manufacturer
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ZTE]
 *         description: Device manufacturer
 *       - in: query
 *         name: api_version
 *         required: true
 *         schema:
 *           type: string
 *           enum: [v5.93]
 *         description: API version
 *       - in: query
 *         name: region
 *         required: true
 *         schema:
 *           type: string
 *         description: User region
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: sessionKey
 *         required: true
 *         schema:
 *           type: string
 *         description: Session key
 *     responses:
 *       200:
 *         description: Asset configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assets:
 *                   type: object
 *                   additionalProperties: true
 *                   description: Key-value pairs of configuration items
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Asset configuration not found
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
router.get('/asset', apaController.getAsset);

/**
 * @swagger
 * /apa/metadata:
 *   get:
 *     summary: Retrieve content metadata and parameters
 *     tags: [Asset]
 *     responses:
 *       200:
 *         description: Metadata configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MetadataConfig'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/metadata', apaController.getMetadata);

module.exports = router;
