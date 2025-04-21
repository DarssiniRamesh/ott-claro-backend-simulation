const { validationResult, checkSchema } = require('express-validator');

// Validation schemas based on Swagger specification
const validationSchemas = {
  userStartHeader: {
    deviceId: {
      in: ['body'],
      matches: {
        options: [/^[A-Za-z0-9-_]{1,64}$/],
        errorMessage: 'Invalid deviceId format'
      },
      notEmpty: true,
      errorMessage: 'deviceId is required'
    },
    region: {
      in: ['body'],
      matches: {
        options: [/^[A-Z]{2}$/],
        errorMessage: 'Invalid region format (should be 2 uppercase letters)'
      },
      notEmpty: true,
      errorMessage: 'region is required'
    },
    language: {
      in: ['body'],
      optional: true,
      matches: {
        options: [/^[a-z]{2}-[A-Z]{2}$/],
        errorMessage: 'Invalid language format (should be like pt-BR)'
      }
    },
    timezone: {
      in: ['body'],
      optional: true
    },
    deviceType: {
      in: ['body'],
      optional: true,
      isIn: {
        options: [['mobile', 'tablet', 'tv', 'web']],
        errorMessage: 'Invalid device type'
      }
    },
    appVersion: {
      in: ['body'],
      optional: true,
      matches: {
        options: [/^\d+\.\d+\.\d+$/],
        errorMessage: 'Invalid app version format (should be like 1.0.0)'
      }
    }
  },
  navigationData: {
    region: {
      in: ['query'],
      optional: true,
      matches: {
        options: [/^[A-Z]{2}$/],
        errorMessage: 'Invalid region format (should be 2 uppercase letters)'
      }
    },
    language: {
      in: ['query'],
      optional: true,
      matches: {
        options: [/^[a-z]{2}-[A-Z]{2}$/],
        errorMessage: 'Invalid language format (should be like pt-BR)'
      }
    },
    maxDepth: {
      in: ['query'],
      optional: true,
      isInt: {
        options: { min: 1, max: 5 },
        errorMessage: 'maxDepth must be between 1 and 5'
      },
      toInt: true
    }
  },
  assetConfig: {
    assetId: {
      in: ['query'],
      matches: {
        options: [/^[A-Za-z0-9-_]{1,64}$/],
        errorMessage: 'Invalid assetId format'
      },
      notEmpty: true,
      errorMessage: 'assetId is required'
    },
    deviceType: {
      in: ['query'],
      isIn: {
        options: [['mobile', 'tablet', 'tv', 'web']],
        errorMessage: 'Invalid device type'
      },
      notEmpty: true,
      errorMessage: 'deviceType is required'
    },
    quality: {
      in: ['query'],
      optional: true,
      isIn: {
        options: [['SD', 'HD', 'FHD', 'UHD']],
        errorMessage: 'Invalid quality value'
      }
    },
    format: {
      in: ['query'],
      optional: true,
      isIn: {
        options: [['HLS', 'DASH']],
        errorMessage: 'Invalid format value'
      }
    }
  },
  metadataConfig: {
    contentId: {
      in: ['query'],
      matches: {
        options: [/^[A-Za-z0-9-_]{1,64}$/],
        errorMessage: 'Invalid contentId format'
      },
      notEmpty: true,
      errorMessage: 'contentId is required'
    },
    language: {
      in: ['query'],
      optional: true,
      matches: {
        options: [/^[a-z]{2}-[A-Z]{2}$/],
        errorMessage: 'Invalid language format (should be like pt-BR)'
      }
    },
    fields: {
      in: ['query'],
      optional: true,
      customSanitizer: {
        options: (value) => value ? value.split(',') : undefined
      }
    }
  }
};

// Validation middleware factory
const validate = (schema) => {
  return [
    checkSchema(validationSchemas[schema]),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid request parameters',
          code: 'VALIDATION_ERROR',
          validationErrors: errors.array().map(err => err.msg)
        });
      }
      next();
    }
  ];
};

module.exports = { validate };
