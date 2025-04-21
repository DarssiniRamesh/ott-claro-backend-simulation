const jwt = require('jsonwebtoken');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Controller for user-related operations
 */
class UserController {
  /**
   * Initialize user session with device and region information
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static async startHeaderInfo(req, res) {
    try {
      const { deviceId, region, language, timezone, deviceType, appVersion } = req.body;

      // Generate session token
      const sessionToken = jwt.sign(
        {
          deviceId,
          region,
          deviceType: deviceType || 'web',
          timestamp: Date.now()
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Prepare response
      const response = {
        sessionToken,
        userPreferences: {
          language: language || `${region.toLowerCase()}-${region}`,
          region
        }
      };

      res.json(response);
    } catch (error) {
      throw new ApiError('Failed to initialize user session', 'SESSION_INIT_ERROR');
    }
  }
}

module.exports = UserController;
