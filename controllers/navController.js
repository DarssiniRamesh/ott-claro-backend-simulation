const navService = require('../services/navService');

// PUBLIC_INTERFACE
const getNavData = async (req, res, next) => {
  try {
    const navData = await navService.getNavigationData(req.navParams);
    res.json({
      entry: navData,
      response: {},
      status: 0,
      msg: 'OK'
    });
  } catch (error) {
    next({
      entry: {},
      response: {},
      status: 1,
      msg: error.message || 'ERROR'
    });
  }
};

module.exports = {
  getNavData
};
