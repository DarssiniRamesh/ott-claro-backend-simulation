/**
 * Authentication middleware
 * Middleware for protecting routes that require authentication
 */

const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/env.config');

/**
 * Middleware to authenticate requests using JWT
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

/**
 * Mock login function for demonstration purposes
 * In a real application, this would verify credentials against a database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = (req, res) => {
  const { email, password } = req.body;
  
  // In a real application, you would verify the credentials against a database
  // For this simulation, we'll just check for a demo user
  if (email === 'user@example.com' && password === 'password') {
    const user = {
      id: '1',
      email: 'user@example.com',
      role: 'user'
    };
    
    const token = generateToken(user);
    
    return res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  }
  
  return res.status(401).json({
    status: 'error',
    message: 'Invalid credentials'
  });
};

module.exports = {
  authenticate,
  generateToken,
  login
};
