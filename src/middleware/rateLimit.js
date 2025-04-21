const rateLimit = require('express-rate-limit');

// Configure rate limiting options
const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 60 * 1000, // 1 minute window
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      status: 'error',
      message: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      res.status(429).json({
        status: 'error',
        message: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED'
      });
    },
    keyGenerator: (req) => {
      // Use X-Forwarded-For header if behind a proxy, otherwise use IP
      return req.headers['x-forwarded-for'] || req.ip;
    }
  };

  const limiterOptions = { ...defaultOptions, ...options };

  const limiter = rateLimit(limiterOptions);

  // Wrap the limiter to add custom headers
  return (req, res, next) => {
    limiter(req, res, (err) => {
      if (err) return next(err);

      // Add custom rate limit headers
      res.setHeader('X-RateLimit-Limit', limiterOptions.max);
      res.setHeader('X-RateLimit-Remaining', res.getHeader('RateLimit-Remaining'));
      res.setHeader('X-RateLimit-Reset', res.getHeader('RateLimit-Reset'));
      res.setHeader('X-RateLimit-Policy', `${limiterOptions.max} requests per ${limiterOptions.windowMs / 1000} seconds`);

      next();
    });
  };
};

// Create specific rate limiters for different endpoints
const rateLimiters = {
  userStartHeader: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 10 // 10 requests per minute
  }),
  navigation: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 30 // 30 requests per minute
  }),
  asset: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 50 // 50 requests per minute
  }),
  metadata: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 50 // 50 requests per minute
  })
};

module.exports = rateLimiters;
