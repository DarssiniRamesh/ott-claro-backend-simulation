/**
 * APA (Asset and Playback API) controller
 * Controller functions for asset and metadata operations
 */

const { ApiError } = require('../middleware/error.middleware');

/**
 * Get asset information
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getAsset = async (req, res, next) => {
  try {
    const { id } = req.query;
    
    // Validate required parameters
    if (!id) {
      throw new ApiError(400, 'Asset ID is required');
    }
    
    // In a real application, this would fetch the asset from the database or a service
    // For this simulation, we'll return mock data or a 404 error
    if (['asset123', 'asset456', 'asset789'].includes(id)) {
      // Mock asset data
      const asset = {
        id,
        title: id === 'asset123' ? 'Sample Movie' : id === 'asset456' ? 'Another Movie' : 'TV Series',
        type: id === 'asset789' ? 'series' : 'movie',
        duration: id === 'asset123' ? 7200 : id === 'asset456' ? 6300 : 2700,
        streamUrl: `https://example.com/stream/${id}`,
        thumbnailUrl: `https://example.com/thumbnail/${id}.jpg`,
        availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        isHD: true,
        hasSubtitles: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      res.json({
        status: 'success',
        data: {
          asset
        }
      });
    } else {
      throw new ApiError(404, `Asset not found with id: ${id}`);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get asset metadata
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getMetadata = async (req, res, next) => {
  try {
    const { assetId } = req.query;
    
    // Validate required parameters
    if (!assetId) {
      throw new ApiError(400, 'Asset ID is required');
    }
    
    // In a real application, this would fetch the metadata from the database or a service
    // For this simulation, we'll return mock data or a 404 error
    if (['asset123', 'asset456', 'asset789'].includes(assetId)) {
      // Mock metadata based on asset ID
      let metadata;
      
      if (assetId === 'asset123') {
        metadata = {
          assetId,
          title: 'Sample Movie',
          description: 'A sample movie description with exciting plot and characters.',
          releaseYear: 2023,
          genres: ['Action', 'Adventure', 'Sci-Fi'],
          cast: ['Actor One', 'Actor Two', 'Actor Three'],
          director: 'Director Name',
          rating: 'PG-13',
          language: 'English',
          subtitles: ['English', 'Spanish', 'French'],
          runtime: '2h 0m',
          posterUrl: `https://example.com/poster/${assetId}.jpg`,
          trailerUrl: `https://example.com/trailer/${assetId}`
        };
      } else if (assetId === 'asset456') {
        metadata = {
          assetId,
          title: 'Another Movie',
          description: 'Another exciting movie with a thrilling storyline.',
          releaseYear: 2022,
          genres: ['Drama', 'Thriller'],
          cast: ['Actor Four', 'Actor Five'],
          director: 'Another Director',
          rating: 'R',
          language: 'English',
          subtitles: ['English', 'Spanish'],
          runtime: '1h 45m',
          posterUrl: `https://example.com/poster/${assetId}.jpg`,
          trailerUrl: `https://example.com/trailer/${assetId}`
        };
      } else { // asset789
        metadata = {
          assetId,
          title: 'TV Series',
          description: 'A popular TV series with multiple seasons.',
          releaseYear: 2021,
          genres: ['Comedy', 'Drama'],
          cast: ['Actor Six', 'Actor Seven', 'Actor Eight'],
          creator: 'Series Creator',
          rating: 'TV-MA',
          language: 'English',
          subtitles: ['English', 'Spanish', 'German'],
          seasons: 3,
          episodes: 24,
          posterUrl: `https://example.com/poster/${assetId}.jpg`,
          trailerUrl: `https://example.com/trailer/${assetId}`
        };
      }
      
      res.json({
        status: 'success',
        data: {
          metadata
        }
      });
    } else {
      throw new ApiError(404, `Asset metadata not found for asset id: ${assetId}`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAsset,
  getMetadata
};
