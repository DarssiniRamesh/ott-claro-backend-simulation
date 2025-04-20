/**
 * Authentication middleware
 * Middleware for protecting routes that require authentication
 */

const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/env.config');

/**
 * Middleware to authenticate requests using JWT
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: info ? info.message : 'Unauthorized - Invalid token'
      });
    }
    
    // Set the user in the request object
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Middleware to check if user has required role
 * @PUBLIC_INTERFACE
 * @param {string|string[]} roles - Required role(s)
 * @returns {Function} - Express middleware function
 */
const authorize = (roles) => {
  // Convert string to array if single role is provided
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return (req, res, next) => {
    // User must be authenticated first
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized - Authentication required'
      });
    }
    
    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden - Insufficient permissions'
      });
    }
    
    next();
  };
};

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRATION
  });
};

module.exports = {
  authenticate,
  authorize,
  generateToken
};
