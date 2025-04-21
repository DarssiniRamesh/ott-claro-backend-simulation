const dbService = require('./dbService');

// PUBLIC_INTERFACE
const getNavigationData = async () => {
  const db = dbService.readData();
  return db.navigation;
};

module.exports = {
  getNavigationData
};
