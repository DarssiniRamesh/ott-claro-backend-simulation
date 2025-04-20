const { ApiError } = require('../middleware/error.middleware');

/**
 * Get device-specific asset configurations
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getAssetConfig = async (req, res, next) => {
  try {
    const { id, deviceId, resolution, format } = req.query;

    if (!id || !deviceId) {
      throw new ApiError(400, 'Asset ID and device ID are required');
    }

    // Mock asset configuration response
    const assetConfig = {
      id,
      title: 'Sample Asset',
      type: 'movie',
      duration: 7200,
      streamUrl: `https://stream.example.com/${id}`,
      thumbnailUrl: `https://images.example.com/${id}/thumb.jpg`,
      availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isHD: true,
      hasSubtitles: true,
      supportedFormats: ['HLS', 'DASH'],
      supportedResolutions: ['720p', '1080p', '4K'],
      drm: {
        provider: 'widevine',
        token: 'sample-drm-token'
      }
    };

    res.json({
      status: 'success',
      data: assetConfig
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get content metadata and parameters
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getMetadata = async (req, res, next) => {
  try {
    const { id, language = 'en' } = req.query;

    if (!id) {
      throw new ApiError(400, 'Asset ID is required');
    }

    // Mock metadata response
    const metadata = {
      assetId: id,
      title: 'Sample Content',
      description: 'This is a sample content description',
      releaseYear: 2023,
      genres: ['Action', 'Drama'],
      cast: ['Actor 1', 'Actor 2'],
      director: 'Director Name',
      rating: 'PG-13',
      language,
      subtitles: ['en', 'es', 'pt'],
      runtime: '120 minutes',
      posterUrl: `https://images.example.com/${id}/poster.jpg`,
      trailerUrl: `https://trailers.example.com/${id}`,
      tags: ['trending', 'new-release'],
      popularity: 8.5,
      averageRating: 4.5
    };

    res.json({
      status: 'success',
      data: metadata
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssetConfig,
  getMetadata
};
