const { ApiError } = require('../middleware/errorHandler');

/**
 * Controller for navigation-related operations
 */
class NavigationController {
  /**
   * Retrieve hierarchical navigation structure
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static async getNavigationData(req, res) {
    try {
      const { region, language, maxDepth = 3 } = req.query;

      // Mock navigation data (replace with actual data from database)
      const navigationData = [
        {
          id: 'home',
          title: 'Home',
          type: 'category',
          children: [
            {
              id: 'movies',
              title: 'Movies',
              type: 'category',
              children: [
                {
                  id: 'action',
                  title: 'Action',
                  type: 'category'
                }
              ]
            },
            {
              id: 'series',
              title: 'Series',
              type: 'category'
            }
          ]
        }
      ];

      // Set cache control header
      res.set('Cache-Control', 'max-age=300'); // Cache for 5 minutes

      res.json(navigationData);
    } catch (error) {
      throw new ApiError('Failed to retrieve navigation data', 'NAVIGATION_ERROR');
    }
  }
}

module.exports = NavigationController;
