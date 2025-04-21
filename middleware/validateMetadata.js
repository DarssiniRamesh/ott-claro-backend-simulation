// PUBLIC_INTERFACE
const validateMetadata = (req, res, next) => {
  const errors = [];
  const params = req.query;

  // Required parameters validation with fixed values and type validation
  const validations = {
    authpn: { required: true, fixedValue: 'tataelxsi' },
    authpt: { required: true, fixedValue: 'vofee7ohhecai' },
    device_category: { required: true, fixedValue: 'stb' },
    device_type: { required: true },
    device_model: { required: true, fixedValue: 'androidTV' },
    device_manufacturer: { required: true, fixedValue: 'ZTE' },
    api_version: { required: true, fixedValue: 'v5.93' },
    region: { required: true },
    user_id: { required: true, type: 'integer' },
    sessionKey: { required: true }
  };

  Object.entries(validations).forEach(([param, rules]) => {
    // Required validation
    if (rules.required && !params[param]) {
      errors.push(`${param} is required`);
      return;
    }

    if (params[param]) {
      // Fixed value validation
      if (rules.fixedValue && params[param] !== rules.fixedValue) {
        errors.push(`Invalid ${param}. Expected: ${rules.fixedValue}`);
      }

      // Type validation
      if (rules.type === 'integer' && !Number.isInteger(Number(params[param]))) {
        errors.push(`${param} must be an integer`);
      }
    }
  });

  if (errors.length > 0) {
    const error = new Error('Validation failed: ' + errors.join(', '));
    error.statusCode = 400;
    return next(error);
  }

  next();
};

module.exports = validateMetadata;
