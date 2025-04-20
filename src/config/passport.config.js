/**
 * Passport configuration for JWT authentication
 * Configures Passport.js with JWT strategy for authentication
 */

const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./env.config');
const User = require('../models/user.model');

// Options for JWT strategy
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
  passReqToCallback: true
};

/**
 * JWT Strategy for Passport
 * Verifies the JWT token and sets the user in the request object
 */
passport.use(new JwtStrategy(options, async (req, payload, done) => {
  try {
    if (!payload || !payload.id) {
      return done(null, false, { message: 'Invalid token' });
    }
    
    // Find user by ID from the database
    const user = await User.findById(payload.id);
    
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    
    // Set the user in the request object
    const userForToken = {
      id: user._id,
      email: user.email,
      role: user.role
    };
    
    return done(null, userForToken);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;
