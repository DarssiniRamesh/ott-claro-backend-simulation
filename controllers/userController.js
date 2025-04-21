const userService = require('../services/userService');

// PUBLIC_INTERFACE
const startHeaderInfo = async (req, res, next) => {
  try {
    const { deviceInfo, region } = req.body;

    // Validate required fields
    if (!deviceInfo || !region) {
      const error = new Error('Missing required fields');
      error.statusCode = 400;
      throw error;
    }

    const session = await userService.createUserSession(deviceInfo, region);
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startHeaderInfo
};
