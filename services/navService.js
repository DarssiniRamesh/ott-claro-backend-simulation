const dbService = require('./dbService');

// PUBLIC_INTERFACE
const getNavigationData = async (params) => {
  // Verify session key (HKS)
  if (!isValidSessionKey(params.HKS)) {
    throw new Error('Invalid session key');
  }

  // Verify region from user/startheaderinfo
  if (!isValidRegion(params.region)) {
    throw new Error('Invalid region');
  }

  const db = dbService.readData();
  return db.navigation;
};

// Helper function to validate session key
const isValidSessionKey = (hks) => {
  // TODO: Implement actual session key validation
  return true;
};

// Helper function to validate region
const isValidRegion = (region) => {
  // TODO: Implement actual region validation
  return true;
};

module.exports = {
  getNavigationData
};
