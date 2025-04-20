const { ApiError } = require('../middleware/error.middleware');

/**
 * Get hierarchical navigation structure
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getNavigationData = async (req, res, next) => {
  try {
    // Mock navigation data
    const navigationData = {
      navigation: [
        {
          id: 'home',
          title: 'Home',
          path: '/',
          icon: 'home'
        },
        {
          id: 'movies',
          title: 'Movies',
          path: '/movies',
          icon: 'movie',
          children: [
            {
              id: 'new-releases',
              title: 'New Releases',
              path: '/movies/new',
              icon: 'new'
            },
            {
              id: 'trending',
              title: 'Trending',
              path: '/movies/trending',
              icon: 'trending'
            }
          ]
        },
        {
          id: 'series',
          title: 'TV Series',
          path: '/series',
          icon: 'tv',
          children: [
            {
              id: 'popular-series',
              title: 'Popular Series',
              path: '/series/popular',
              icon: 'popular'
            },
            {
              id: 'continue-watching',
              title: 'Continue Watching',
              path: '/series/continue',
              icon: 'play'
            }
          ]
        }
      ]
    };

    res.json({
      status: 'success',
      data: navigationData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNavigationData
};
