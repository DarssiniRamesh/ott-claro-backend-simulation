/**
 * Navigation controller
 * Controller functions for navigation data operations
 */

const { ApiError } = require('../middleware/error.middleware');

/**
 * Get navigation data
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getData = async (req, res, next) => {
  try {
    // Get region from query params (optional)
    const { region } = req.query;
    
    // In a real application, this would fetch navigation data from the database or a service
    // For this simulation, we'll return mock data
    const navigationData = [
      {
        id: 'home',
        title: 'Home',
        path: '/home',
        icon: 'home',
        children: []
      },
      {
        id: 'movies',
        title: 'Movies',
        path: '/movies',
        icon: 'film',
        children: [
          {
            id: 'action',
            title: 'Action',
            path: '/movies/action',
            icon: 'bolt'
          },
          {
            id: 'comedy',
            title: 'Comedy',
            path: '/movies/comedy',
            icon: 'smile'
          },
          {
            id: 'drama',
            title: 'Drama',
            path: '/movies/drama',
            icon: 'theater-masks'
          }
        ]
      },
      {
        id: 'series',
        title: 'Series',
        path: '/series',
        icon: 'tv',
        children: [
          {
            id: 'popular',
            title: 'Popular',
            path: '/series/popular',
            icon: 'fire'
          },
          {
            id: 'new',
            title: 'New Releases',
            path: '/series/new',
            icon: 'calendar-plus'
          }
        ]
      },
      {
        id: 'live',
        title: 'Live TV',
        path: '/live',
        icon: 'broadcast-tower',
        children: []
      }
    ];
    
    // If region is specified, we could customize the navigation data
    // This is just a simple example of how it might work
    if (region) {
      // Add a region-specific category
      navigationData.push({
        id: 'local',
        title: `Local (${region})`,
        path: `/local/${region}`,
        icon: 'map-marker',
        children: []
      });
    }
    
    res.json({
      status: 'success',
      data: {
        navigation: navigationData
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getData
};
