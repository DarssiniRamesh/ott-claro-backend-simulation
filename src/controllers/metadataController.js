const { ApiError, NotFoundError } = require('../middleware/errorHandler');

/**
 * Controller for metadata-related operations
 */
class MetadataController {
  /**
   * Get content metadata and parameters
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static async getMetadataConfig(req, res) {
    try {
      const { contentId, language, fields } = req.query;

      // Mock metadata (replace with actual data from database)
      const metadata = {
        id: contentId,
        title: 'Example Movie',
        description: 'An exciting movie',
        genres: ['Action', 'Adventure'],
        ratings: {
          imdb: 8.5,
          rottenTomatoes: 85
        }
      };

      // Simulate not found error for testing
      if (contentId === 'notfound') {
        throw new NotFoundError('Content not found');
      }

      // Filter fields if specified
      if (fields) {
        const filteredMetadata = {};
        fields.forEach(field => {
          if (field in metadata) {
            filteredMetadata[field] = metadata[field];
          }
        });
        res.set('Cache-Control', 'max-age=3600'); // Cache for 1 hour
        return res.json(filteredMetadata);
      }

      res.set('Cache-Control', 'max-age=3600'); // Cache for 1 hour
      res.json(metadata);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new ApiError('Failed to retrieve metadata', 'METADATA_ERROR');
    }
  }
}

module.exports = MetadataController;
