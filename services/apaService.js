const dbService = require('./dbService');

// PUBLIC_INTERFACE
const getAssetConfig = async (deviceType) => {
  const db = dbService.readData();
  return db.assets.find(asset => asset.deviceType === deviceType) || db.assets.find(asset => asset.id === 'default');
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
