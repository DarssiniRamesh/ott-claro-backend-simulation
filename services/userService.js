const { v4: uuidv4 } = require('uuid');
const dbService = require('./dbService');

// PUBLIC_INTERFACE
const createUserSession = async (deviceInfo, region) => {
  const db = dbService.readData();
  
  const newSession = {
    sessionId: uuidv4(),
    deviceInfo,
    region,
    createdAt: new Date().toISOString()
  };

  db.users.push(newSession);
  dbService.writeData(db);

  return newSession;
};

module.exports = {
  createUserSession
};
