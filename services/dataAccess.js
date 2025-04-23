const fs = require('fs');
const path = require('path');

// Cache object to store loaded data
const dataCache = {};

/**
 * PUBLIC_INTERFACE
 * Read JSON file with caching
 * @param {string} filename - Name of the JSON file to read
 * @returns {Object} Parsed JSON data
 */
const readJsonFile = (filename) => {
  try {
    const filePath = path.join(__dirname, '../data', filename);

    // Check if data is in cache and file hasn't been modified
    if (dataCache[filename]) {
      const stats = fs.statSync(filePath);
      if (stats.mtime.getTime() === dataCache[filename].lastModified) {
        return dataCache[filename].data;
      }
    }

    // Read and parse file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Update cache
    const stats = fs.statSync(filePath);
    dataCache[filename] = {
      data,
      lastModified: stats.mtime.getTime()
    };

    return data;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw new Error(`Failed to read data from ${filename}`);
  }
};

module.exports = {
  readJsonFile
};
