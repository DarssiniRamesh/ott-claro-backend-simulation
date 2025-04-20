/**
 * Cache middleware
 * Simple in-memory caching for GET endpoints
 */

const config = require('../config/env.config');

// In-memory cache store
const cache = new Map();

/**
 * Get cache key from request
 * @param {Object} req - Express request object
 * @returns {string} Cache key
 */
const getCacheKey = (req) => {
  return `${req.method}:${req.originalUrl}`;
};

/**
 * Middleware to cache responses from GET requests
 * @param {number} duration - Cache duration in seconds (defaults to value from config)
 * @returns {Function} Express middleware function
 */
const cacheMiddleware = (duration = config.CACHE_DURATION) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    const key = getCacheKey(req);
    const cachedResponse = cache.get(key);
    
    // If cache hit, return cached response
    if (cachedResponse) {
      const { data, timestamp } = cachedResponse;
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - timestamp < duration * 1000) {
        return res.json(data);
      } else {
        // Cache expired, remove it
        cache.delete(key);
      }
    }
    
    // Store the original json method
    const originalJson = res.json;
    
    // Override the json method to cache the response
    res.json = function(data) {
      // Store in cache
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
      
      // Call the original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Clear the entire cache or a specific key
 * @param {string} [key] - Specific cache key to clear (optional)
 */
const clearCache = (key) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

module.exports = {
  cacheMiddleware,
  clearCache,
  getCacheKey
};
