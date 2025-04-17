/**
 * Navigation routes
 * Routes for navigation data
 */

const express = require('express');
const router = express.Router();
const navController = require('../controllers/nav.controller');
const { cacheMiddleware } = require('../middleware/cache.middleware');

/**
 * @swagger
 * tags:
 *   name: Navigation
 *   description: Navigation data API
 */

/**
 * @swagger
 * /nav/data:
 *   get:
 *     summary: Get navigation data
 *     description: Retrieve navigation data for the application
 *     tags: [Navigation]
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Region code for localized navigation data
 *     responses:
 *       200:
 *         description: Navigation data
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
 *                             example: home
 *                           title:
 *                             type: string
 *                             example: Home
 *                           path:
 *                             type: string
 *                             example: /home
 *                           icon:
 *                             type: string
 *                             example: home
 *                           children:
 *                             type: array
 *                             items:
 *                               type: object
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/data', cacheMiddleware(), navController.getData);

module.exports = router;
