const expressJSDocSwagger = require('express-jsdoc-swagger');
const swaggerUi = require('swagger-ui-express');

const options = {
  info: {
    version: '1.0.0',
    title: 'OTT Claro Backend Simulation API',
    description: 'API documentation for OTT Claro Backend Simulation',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
    }
  },
  security: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  baseDir: __dirname,
  filesPattern: '../**/*.js',
  swaggerUIPath: '/api-docs',
  exposeSwaggerUI: true,
  exposeApiDocs: true,
  apiDocsPath: '/api-docs.json',
  notRequiredAsNullable: false,
  swaggerUiOptions: {},
};

/**
 * @typedef {object} MongooseConnectionStatus
 * @property {string} state.required - Current connection state - Enum: [connected, connecting, disconnected, disconnecting] - Example: connected
 * @property {string} database.required - Database name - Example: ott_claro_simulation
 * @property {string} host.required - Database host - Example: localhost:27017
 * @property {number} readyState.required - Mongoose connection ready state (0-3) - Minimum: 0 - Maximum: 3 - Example: 1
 * @property {object} [error] - Connection error details if any
 * @property {string} [error.message] - Error message - Example: Connection timeout
 * @property {string} [error.code] - Error code - Example: ETIMEDOUT
 */

/**
 * @typedef {object} CacheKeyResponse
 * @property {string} key.required - Cache key identifier - Example: nav:BR:pt-BR
 * @property {boolean} exists.required - Whether the key exists in cache - Example: true
 * @property {string} status.required - Cache entry status - Enum: [valid, expired, missing] - Example: valid
 * @property {number} [ttl] - Time to live in seconds - Minimum: 0 - Example: 3600
 * @property {string} [lastUpdated] - ISO timestamp of last update - Example: 2023-11-01T10:00:00Z
 * @property {object} [metadata] - Additional cache entry metadata
 * @property {string} [metadata.type] - Type of cached content - Example: navigation
 * @property {string} [metadata.region] - Region associated with cache - Example: BR
 */

/**
 * @typedef {object} ErrorResponse
 * @property {string} message.required - Error message - Example: Invalid request parameters
 * @property {string} code.required - Error code - Example: VALIDATION_ERROR
 * @property {string} [details] - Detailed error information
 * @property {array<string>} [validationErrors] - List of validation errors
 */

/**
 * @typedef {object} UserStartHeaderInfo
 * @property {string} deviceId.required - Unique device identifier - Pattern: ^[A-Za-z0-9-_]{1,64}$ - Example: device-123abc
 * @property {string} region.required - User's region code - Pattern: ^[A-Z]{2}$ - Example: BR
 * @property {string} [language] - Preferred language - Pattern: ^[a-z]{2}-[A-Z]{2}$ - Example: pt-BR
 * @property {string} [timezone] - User's timezone - Example: America/Sao_Paulo
 * @property {string} [deviceType] - Type of device - Enum: [mobile, tablet, tv, web] - Example: mobile
 * @property {string} [appVersion] - Application version - Pattern: ^\d+\.\d+\.\d+$ - Example: 1.0.0
 */

/**
 * @typedef {object} UserStartHeaderResponse
 * @property {string} sessionToken.required - JWT session token
 * @property {object} userPreferences.required - User preferences
 * @property {string} userPreferences.language - Selected language
 * @property {string} userPreferences.region - Selected region
 */

/**
 * @typedef {object} NavigationItem
 * @property {string} id.required - Navigation item ID
 * @property {string} title.required - Display title
 * @property {string} type.required - Item type (category/content)
 * @property {array<NavigationItem>} [children] - Child navigation items
 */

/**
 * @typedef {object} AssetConfig
 * @property {string} id.required - Asset ID
 * @property {string} type.required - Asset type
 * @property {object} playbackConfig.required - Playback configuration
 * @property {string} playbackConfig.url - Streaming URL
 * @property {string} playbackConfig.format - Format (HLS/DASH)
 */

/**
 * @typedef {object} MetadataConfig
 * @property {string} id.required - Content ID
 * @property {string} title.required - Content title
 * @property {string} description - Content description
 * @property {array<string>} genres - Content genres
 * @property {object} ratings - Content ratings
 */

/**
 * POST /api/user/startheaderinfo
 * @summary Initialize user session with device and region information
 * @tags User Session
 * @param {UserStartHeaderInfo} request.body.required - User session initialization parameters
 * @return {UserStartHeaderResponse} 200 - Success response
 * @return {ErrorResponse} 400 - Bad request - Invalid parameters provided
 * @return {ErrorResponse} 429 - Too Many Requests - Rate limit exceeded
 * @return {ErrorResponse} 500 - Server error - Internal server error
 * @header {string} X-RateLimit-Limit - Maximum number of requests allowed per window - Example: 100
 * @header {string} X-RateLimit-Remaining - Number of requests remaining in current window - Example: 99
 * @header {string} X-RateLimit-Reset - Time when the rate limit window resets in UTC epoch seconds - Example: 1635724800
 * @header {string} X-RateLimit-Policy - Rate limit policy details - Example: 100 requests per 60 seconds
 * @example request - Example request payload
 * {
 *   "deviceId": "device123",
 *   "region": "BR",
 *   "language": "pt-BR",
 *   "timezone": "America/Sao_Paulo"
 * }
 * @example response - 200 - Example success response
 * {
 *   "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "userPreferences": {
 *     "language": "pt-BR",
 *     "region": "BR"
 *   }
 * }
 */

/**
 * GET /api/nav/data
 * @summary Retrieve hierarchical navigation structure
 * @tags Navigation
 * @security BearerAuth
 * @param {string} [region] - Filter navigation by region - Pattern: ^[A-Z]{2}$ - Example: BR
 * @param {string} [language] - Filter by language - Pattern: ^[a-z]{2}-[A-Z]{2}$ - Example: pt-BR
 * @param {number} [maxDepth=3] - Maximum depth of navigation tree - Minimum: 1 - Maximum: 5
 * @return {array<NavigationItem>} 200 - Success response
 * @return {ErrorResponse} 401 - Unauthorized - Invalid or expired token
 * @return {ErrorResponse} 429 - Too Many Requests - Rate limit exceeded
 * @return {ErrorResponse} 500 - Server error - Internal server error
 * @header {string} X-RateLimit-Limit - Maximum number of requests allowed per window
 * @header {string} X-RateLimit-Remaining - Number of requests remaining in current window
 * @header {string} X-RateLimit-Reset - Time when the rate limit window resets
 * @header {string} Cache-Control - Cache control header - Example: max-age=300
 * @example response - 200 - Example success response
 * [{
 *   "id": "home",
 *   "title": "Home",
 *   "type": "category",
 *   "children": [{
 *     "id": "movies",
 *     "title": "Movies",
 *     "type": "category"
 *   }]
 * }]
 */

/**
 * GET /api/apa/asset
 * @summary Get device-specific asset configurations
 * @tags Asset
 * @security BearerAuth
 * @param {string} assetId.query.required - Asset identifier - Pattern: ^[A-Za-z0-9-_]{1,64}$ - Example: movie-123
 * @param {string} deviceType.query.required - Type of device - Enum: [mobile, tablet, tv, web] - Example: mobile
 * @param {string} [quality] - Requested quality - Enum: [SD, HD, FHD, UHD] - Example: HD
 * @param {string} [format] - Streaming format - Enum: [HLS, DASH] - Example: HLS
 * @return {AssetConfig} 200 - Success response
 * @return {ErrorResponse} 400 - Bad Request - Invalid parameters
 * @return {ErrorResponse} 401 - Unauthorized - Invalid or expired token
 * @return {ErrorResponse} 403 - Forbidden - Insufficient permissions
 * @return {ErrorResponse} 404 - Asset not found
 * @return {ErrorResponse} 429 - Too Many Requests - Rate limit exceeded
 * @return {ErrorResponse} 500 - Server error - Internal server error
 * @header {string} X-RateLimit-Limit - Maximum number of requests allowed per window
 * @header {string} X-RateLimit-Remaining - Number of requests remaining in current window
 * @header {string} X-RateLimit-Reset - Time when the rate limit window resets
 * @example response - 200 - Example success response
 * {
 *   "id": "movie123",
 *   "type": "movie",
 *   "playbackConfig": {
 *     "url": "https://streaming.example.com/movie123/master.m3u8",
 *     "format": "HLS"
 *   }
 * }
 */

/**
 * GET /api/apa/metadata
 * @summary Retrieve content metadata and parameters
 * @tags Metadata
 * @security BearerAuth
 * @param {string} contentId.query.required - Content identifier - Pattern: ^[A-Za-z0-9-_]{1,64}$ - Example: movie-123
 * @param {string} [language] - Content language - Pattern: ^[a-z]{2}-[A-Z]{2}$ - Example: pt-BR
 * @param {string} [fields] - Comma-separated list of fields to include - Example: title,description,genres
 * @return {MetadataConfig} 200 - Success response
 * @return {ErrorResponse} 400 - Bad Request - Invalid parameters
 * @return {ErrorResponse} 401 - Unauthorized - Invalid or expired token
 * @return {ErrorResponse} 403 - Forbidden - Insufficient permissions
 * @return {ErrorResponse} 404 - Content not found
 * @return {ErrorResponse} 429 - Too Many Requests - Rate limit exceeded
 * @return {ErrorResponse} 500 - Server error - Internal server error
 * @header {string} X-RateLimit-Limit - Maximum number of requests allowed per window
 * @header {string} X-RateLimit-Remaining - Number of requests remaining in current window
 * @header {string} X-RateLimit-Reset - Time when the rate limit window resets
 * @header {string} Cache-Control - Cache control header - Example: max-age=3600
 * @example response - 200 - Example success response
 * {
 *   "id": "movie123",
 *   "title": "Example Movie",
 *   "description": "An exciting movie",
 *   "genres": ["Action", "Adventure"],
 *   "ratings": {
 *     "imdb": 8.5,
 *     "rottenTomatoes": 85
 *   }
 * }
 */

module.exports = (app) => {
  // Initialize express-jsdoc-swagger
  const instance = expressJSDocSwagger(app)(options);

  // Setup swagger-ui-express once the OpenAPI spec is generated
  instance.on('finish', (swaggerDef) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDef));
  });
};
