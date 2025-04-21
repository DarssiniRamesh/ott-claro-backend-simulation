const express = require('express');
const router = express.Router();
const apaController = require('../controllers/apaController');

/**
 * @swagger
 * /apa/asset:
 *   get:
 *     summary: Get device-specific asset configurations
 *     tags: [Asset]
 *     responses:
 *       200:
 *         description: Asset configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssetConfig'
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
