const NavService = require('../services/navService');

class NavController {
  constructor() {
    this.navService = new NavService();
  }

  /**
   * PUBLIC_INTERFACE
   * Handles GET requests for navigation data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getNavData(req, res) {
    try {
      // Set Content-Type header
      res.setHeader('Content-Type', 'application/json');

      // navParams is set by validateNavData middleware
      const { navParams } = req;
      
      // Get navigation data from service
      const navigationData = await this.navService.getNavigationData(navParams);
      
      if (!navigationData) {
        return res.status(404).json({
          entry: {
            authpn: 'tataelxsi',
            authpt: 'vofee7ohhecai',
            device_category: 'stb',
            device_type: 'ptv',
            device_model: 'androidTV',
            device_manufacturer: 'ZTE',
            HKS: '63eb2f6aebf9b',
            api_version: 'v5.93',
            region: 'peru',
            device_id: 'ZTEATV41200438564',
            device_so: 'Android 10',
            format: 'json',
            device_name: 'B866V2_AMX_ATV_PE'
          },
          response: { nodes: [] },
          status: 1,
          msg: 'Navigation data not found'
        });
      }
      
      return res.status(200).json(navigationData);
    } catch (error) {
      console.error('Error in getNavData:', error);
      // Return error response in the required format
      return res.status(500).json({
        entry: {
          authpn: 'tataelxsi',
          authpt: 'vofee7ohhecai',
          device_category: 'stb',
          device_type: 'ptv',
          device_model: 'androidTV',
          device_manufacturer: 'ZTE',
          HKS: '63eb2f6aebf9b',
          api_version: 'v5.93',
          region: 'peru',
          device_id: 'ZTEATV41200438564',
          device_so: 'Android 10',
          format: 'json',
          device_name: 'B866V2_AMX_ATV_PE'
        },
        response: { nodes: [] },
        status: 1,
        msg: error.message || 'Internal server error'
      });
    }
  }
}

// Create singleton instance
const navController = new NavController();

// Bind methods to instance to preserve 'this' context
navController.getNavData = navController.getNavData.bind(navController);

module.exports = navController;
