const apaService = require('../services/apaService');

// PUBLIC_INTERFACE
const getAsset = async (req, res, next) => {
  try {
    const { deviceType } = req.query;
    
    if (!deviceType) {
      const error = new Error('Device type is required');
      error.statusCode = 400;
      throw error;
    }

    const assetConfig = await apaService.getAssetConfig(deviceType);
    res.json(assetConfig);
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
const getMetadata = async (req, res, next) => {
  try {
    const metadata = await apaService.getMetadata();
    res.json(metadata);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAsset,
  getMetadata
};
