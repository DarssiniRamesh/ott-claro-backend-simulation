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
 *         description: Metadata configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 translations:
 *                   type: object
 *                   nullable: true
 *                   description: Translation strings for UI elements
 *                 sprites_configuration:
 *                   type: object
 *                   nullable: true
 *                   description: Configuration for sprite images
 *                 atv_hide_pack_logo:
 *                   type: boolean
 *                   nullable: true
 *                   description: Flag to control pack logo visibility
 *                 third_party_epg_apps:
 *                   type: array
 *                   nullable: true
 *                   description: List of third-party EPG applications
 *                 logs_dashboard_url:
 *                   type: string
 *                   nullable: true
 *                   description: URL for accessing logs dashboard
 *                 lms_bootstrap_url:
 *                   type: string
 *                   nullable: true
 *                   description: URL for LMS bootstrap service
 *                 byr_filterlist_configuration:
 *                   type: object
 *                   nullable: true
 *                   description: Configuration for BYR filter list
 *                 time_to_get_favs:
 *                   type: number
 *                   nullable: true
 *                   description: Time interval for fetching favorites
 *                 sentinel_reminders_interval:
 *                   type: number
 *                   nullable: true
 *                   description: Interval for sentinel reminders
 *                 pin_use_channel_rating_flow:
 *                   type: boolean
 *                   nullable: true
 *                   description: Flag to control channel rating flow with PIN
 *                 time_to_get_recordings:
 *                   type: number
 *                   nullable: true
 *                   description: Time interval for fetching recordings
 *                 onboarding:
 *                   type: object
 *                   nullable: true
 *                   description: Onboarding configuration settings
 *                 interval_time_check_epg_version:
 *                   type: number
 *                   nullable: true
 *                   description: Interval for checking EPG version updates
 *                 interval_time_check_lineal_channels:
 *                   type: number
 *                   nullable: true
 *                   description: Interval for checking linear channel updates
 *                 fast_forward_rewind_option:
 *                   type: object
 *                   nullable: true
 *                   description: Configuration for fast-forward and rewind functionality
 *                 supported_stream:
 *                   type: array
 *                   nullable: true
 *                   description: List of supported streaming formats
 *                 isloggedin_refresh_hours_time:
 *                   type: number
 *                   nullable: true
 *                   description: Time interval for refreshing login status
 *                 atv_max_buffer_ms:
 *                   type: number
 *                   nullable: true
 *                   description: Maximum buffer size in milliseconds for Android TV
 *                 atv_min_buffer_ms:
 *                   type: number
 *                   nullable: true
 *                   description: Minimum buffer size in milliseconds for Android TV
 *                 atv_rebuffer_ms:
 *                   type: number
 *                   nullable: true
 *                   description: Rebuffer time in milliseconds for Android TV
 *                 atv_start_buffer_ms:
 *                   type: number
 *                   nullable: true
 *                   description: Initial buffer size in milliseconds for Android TV
 *                 myaccount_configuration:
 *                   type: object
 *                   nullable: true
 *                   description: Configuration settings for My Account section
 *                 fallback_interval_time:
 *                   type: number
 *                   nullable: true
 *                   description: Time interval for fallback operations
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const validateMetadata = require('../middleware/validateMetadata');
router.get('/metadata', validateMetadata, apaController.getMetadata);

module.exports = router;
