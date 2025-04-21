const express = require('express');
const router = express.Router();
const navController = require('../controllers/navController');
const validateNavData = require('../middleware/validateNavData');

/**
 * @swagger
 * /nav/data:
 *   get:
 *     summary: Retrieve hierarchical navigation structure
 *     tags: [Navigation]
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
 *         name: HKS
 *         required: true
 *         schema:
 *           type: string
 *         description: HKS parameter
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
 *         description: Region identifier
 *       - in: query
 *         name: device_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Device identifier
 *     responses:
 *       200:
 *         description: Navigation data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entry:
 *                   type: object
 *                   description: Response data entry
 *                 response:
 *                   type: object
 *                   description: Response data
 *                 status:
 *                   type: integer
 *                   enum: [0]
 *                   description: Status code (0 for success)
 *                 msg:
 *                   type: string
 *                   enum: [OK]
 *                   description: Status message
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entry:
 *                   type: object
 *                   description: Empty object for error
 *                 response:
 *                   type: object
 *                   description: Empty object for error
 *                 status:
 *                   type: integer
 *                   enum: [1]
 *                   description: Status code (1 for error)
 *                 msg:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/data', validateNavData, navController.getNavData);

module.exports = router;
