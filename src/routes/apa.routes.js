/**
 * APA (Asset and Playback API) routes
 * Routes for asset and metadata operations
 */

const express = require('express');
const router = express.Router();
const apaController = require('../controllers/apa.controller');
const { cacheMiddleware } = require('../middleware/cache.middleware');

/**
 * @swagger
 * tags:
 *   name: APA
 *   description: Asset and Playback API
 */

/**
 * @swagger
 * /apa/asset:
 *   get:
 *     summary: Get asset information
 *     description: Retrieve information for a specific asset
 *     tags: [APA]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Asset ID
 *     responses:
 *       200:
 *         description: Asset information
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
 *                     asset:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: asset123
 *                         title:
 *                           type: string
 *                           example: Sample Movie
 *                         type:
 *                           type: string
 *                           example: movie
 *                         duration:
 *                           type: integer
 *                           example: 7200
 *                         streamUrl:
 *                           type: string
 *                           example: https://example.com/stream/asset123
 *       400:
 *         description: Invalid request - Missing asset ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Asset not found
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
router.get('/asset', cacheMiddleware(), apaController.getAsset);

/**
 * @swagger
 * /apa/metadata:
 *   get:
 *     summary: Get asset metadata
 *     description: Retrieve metadata for a specific asset
 *     tags: [APA]
 *     parameters:
 *       - in: query
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *         description: Asset ID
 *     responses:
 *       200:
 *         description: Asset metadata
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
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         assetId:
 *                           type: string
 *                           example: asset123
 *                         title:
 *                           type: string
 *                           example: Sample Movie
 *                         description:
 *                           type: string
 *                           example: A sample movie description
 *                         releaseYear:
 *                           type: integer
 *                           example: 2023
 *                         genres:
 *                           type: array
 *                           items:
 *                             type: string
 *                             example: Action
 *                         cast:
 *                           type: array
 *                           items:
 *                             type: string
 *                             example: Actor Name
 *                         director:
 *                           type: string
 *                           example: Director Name
 *                         rating:
 *                           type: string
 *                           example: PG-13
 *       400:
 *         description: Invalid request - Missing asset ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Asset metadata not found
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
router.get('/metadata', cacheMiddleware(), apaController.getMetadata);

module.exports = router;
