const navService = require('../services/navService');

// PUBLIC_INTERFACE
const getNavData = async (req, res, next) => {
  try {
    const navData = await navService.getNavigationData();
    res.json(navData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNavData
};
