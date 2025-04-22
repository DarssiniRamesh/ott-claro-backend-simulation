const navService = require('../services/navService');

/**
 * PUBLIC_INTERFACE
 * Retrieves navigation data based on provided parameters
 * @param {Object} req - Express request object with validated navigation parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getNavData = async (req, res, next) => {
  try {
    const { nodes } = await navService.getNavigationData(req.navParams);
    
    // Return successful response with standardized format
    const response = {
      entry: {
        authpn: String(req.navParams.authpn || 'tataelxsi'),
        authpt: String(req.navParams.authpt || 'vofee7ohhecai'),
        device_category: String(req.navParams.device_category || 'stb'),
        device_type: String(req.navParams.device_type || 'ptv'),
        device_model: String(req.navParams.device_model || 'androidTV'),
        device_manufacturer: String(req.navParams.device_manufacturer || 'ZTE'),
        HKS: String(req.navParams.HKS || 'sample-session-key'),
        api_version: String(req.navParams.api_version || 'v5.93'),
        region: String(req.navParams.region || 'sample-region'),
        device_id: String(req.navParams.device_id || 'sample-device-id')
      },
      response: { 
        nodes: Array.isArray(nodes) ? nodes : [] // Ensure nodes is always an array
      },
      status: 0, // Integer status code for success
      msg: String('OK')
    });
  } catch (error) {
    // Pass error to error handler with standardized format
    const errorResponse = {
      entry: {
        authpn: String(req.navParams?.authpn || 'tataelxsi'),
        authpt: String(req.navParams?.authpt || 'vofee7ohhecai'),
        device_category: String(req.navParams?.device_category || 'stb'),
        device_type: String(req.navParams?.device_type || 'ptv'),
        device_model: String(req.navParams?.device_model || 'androidTV'),
        device_manufacturer: String(req.navParams?.device_manufacturer || 'ZTE'),
        HKS: String(req.navParams?.HKS || 'sample-session-key'),
        api_version: String(req.navParams?.api_version || 'v5.93'),
        region: String(req.navParams?.region || 'sample-region'),
        device_id: String(req.navParams?.device_id || 'sample-device-id')
      },
      response: { 
        nodes: [] // Empty array for error case
      },
      status: 1, // Integer status code for error
      msg: String(error.message || 'ERROR')
    });
  }
};

module.exports = {
  getNavData
};
