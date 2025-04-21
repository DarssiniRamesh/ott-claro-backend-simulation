const dbService = require('./dbService');

// PUBLIC_INTERFACE
const getAssetConfig = async (params) => {
  const db = dbService.readData();
  const assetConfig = db.assets.find(asset => asset.deviceType === params.device_type) || 
                     db.assets.find(asset => asset.id === 'default');
  
  if (!assetConfig) {
    const error = new Error('Asset configuration not found');
    error.statusCode = 404;
    throw error;
  }

  // Convert to key-value pairs format
  return Object.entries(assetConfig.config || {}).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
};

// PUBLIC_INTERFACE
const getMetadata = async () => {
  const db = dbService.readData();
  return db.metadata;
};

module.exports = {
  getAssetConfig,
  getMetadata
};
