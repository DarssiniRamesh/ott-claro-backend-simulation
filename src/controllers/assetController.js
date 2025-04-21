const { ApiError, NotFoundError } = require('../middleware/errorHandler');

/**
 * Controller for asset-related operations
 */
class AssetController {
  /**
   * Get device-specific asset configurations
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static async getAssetConfig(req, res) {
    try {
      const { assetId, deviceType, quality = 'HD', format = 'HLS' } = req.query;

      // Mock asset data (replace with actual data from database)
      const assetConfig = {
        id: assetId,
        type: 'movie',
        playbackConfig: {
          url: `https://streaming.example.com/${assetId}/master.m3u8`,
          format: format
        }
      };

      // Simulate not found error for testing
      if (assetId === 'notfound') {
        throw new NotFoundError('Asset not found');
      }

      res.json(assetConfig);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new ApiError('Failed to retrieve asset configuration', 'ASSET_CONFIG_ERROR');
    }
  }
}

module.exports = AssetController;
