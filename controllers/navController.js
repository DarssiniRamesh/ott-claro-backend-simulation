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
    const navData = await navService.getNavigationData(req.navParams);
    
    // Return successful response with standardized format
    res.status(200).json({
      entry: navData || {},  // Ensure entry is always an object
      response: {},         // Empty response object as per schema
      status: 0,           // 0 indicates success
      msg: 'OK'            // Standard success message
    });
  } catch (error) {
    // Pass error to error handler with standardized format
    next({
      entry: {},
      response: {},
      status: 1,           // 1 indicates error
      msg: error.message || 'ERROR'
    });
  }
};

module.exports = {
  getNavData
};
