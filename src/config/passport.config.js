/**
 * Passport configuration for JWT authentication
 * Configures Passport.js with JWT strategy for authentication
 */

const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./env.config');

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
    // In a real application, you would verify the user from the database
    // For this simulation, we'll just use the payload data
    if (!payload || !payload.id) {
      return done(null, false, { message: 'Invalid token' });
    }
    
    // Set the user in the request object
    const user = {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };
    
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;
