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
  const navData = db.navigation;

  // Transform navigation data into properly typed nodes array
  const nodes = [
    ...(Array.isArray(navData.sections) ? navData.sections : []).map(section => ({
      id: String(section.id || ''),
      name: String(section.name || ''),
      order: parseInt(section.order || 0, 10), // Ensure integer
      type: String('section'),
      categories: Array.isArray(section.categories) ? 
        section.categories.map(cat => String(cat || '')) : 
        []
    })),
    ...(Array.isArray(navData.categories) ? navData.categories : []).map(category => ({
      id: String(category.id || ''),
      name: String(category.name || ''),
      type: String(category.type || '')
    }))
  ];

  return {
    nodes // Array is guaranteed by construction
  };
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
