/**
 * APA (Asset and Metadata) routes
 * Routes for handling asset configuration and metadata requests
 */

const express = require('express');
const router = express.Router();
const apaController = require('../controllers/apa.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { cacheMiddleware } = require('../middleware/cache.middleware');

/**
 * @swagger
 * tags:
 *   name: APA
 *   description: Asset and metadata management API
 */

/**
 * @swagger
 * /apa/asset:
 *   get:
 *     summary: Get device-specific asset configurations
 *     description: Retrieve asset configuration based on device and format requirements
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
 *           enum: [720p, 1080p, 4K]
 *         description: Desired resolution
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [HLS, DASH]
 *         description: Streaming format
 *     responses:
 *       200:
 *         description: Asset configuration retrieved successfully
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
 *                     id:
 *                       type: string
 *                       example: asset123
 *                     title:
 *                       type: string
 *                       example: Sample Asset
 *                     type:
 *                       type: string
 *                       example: movie
 *                     duration:
 *                       type: number
 *                       example: 7200
 *                     streamUrl:
 *                       type: string
 *                       example: https://stream.example.com/asset123
 *                     thumbnailUrl:
 *                       type: string
 *                       example: https://images.example.com/asset123/thumb.jpg
 *                     availableUntil:
 *                       type: string
 *                       format: date-time
 *                     isHD:
 *                       type: boolean
 *                       example: true
 *                     hasSubtitles:
 *                       type: boolean
 *                       example: true
 *                     supportedFormats:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: HLS
 *                     supportedResolutions:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: 1080p
 *                     drm:
 *                       type: object
 *                       properties:
 *                         provider:
 *                           type: string
 *                           example: widevine
 *                         token:
 *                           type: string
 *                           example: sample-drm-token
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
router.get('/asset', authenticate, cacheMiddleware(), apaController.getAssetConfig);

/**
 * @swagger
 * /apa/metadata:
 *   get:
 *     summary: Get content metadata
 *     description: Retrieve content metadata and parameters
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
 *           default: en
 *         description: Preferred language for metadata
 *     responses:
 *       200:
 *         description: Metadata retrieved successfully
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
 *                     assetId:
 *                       type: string
 *                       example: asset123
 *                     title:
 *                       type: string
 *                       example: Sample Content
 *                     description:
 *                       type: string
 *                       example: This is a sample content description
 *                     releaseYear:
 *                       type: number
 *                       example: 2023
 *                     genres:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: Action
 *                     cast:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: Actor 1
 *                     director:
 *                       type: string
 *                       example: Director Name
 *                     rating:
 *                       type: string
 *                       example: PG-13
 *                     language:
 *                       type: string
 *                       example: en
 *                     subtitles:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: en
 *                     runtime:
 *                       type: string
 *                       example: 120 minutes
 *                     posterUrl:
 *                       type: string
 *                       example: https://images.example.com/asset123/poster.jpg
 *                     trailerUrl:
 *                       type: string
 *                       example: https://trailers.example.com/asset123
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: trending
 *                     popularity:
 *                       type: number
 *                       example: 8.5
 *                     averageRating:
 *                       type: number
 *                       example: 4.5
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
router.get('/metadata', authenticate, cacheMiddleware(), apaController.getMetadata);

module.exports = router;
