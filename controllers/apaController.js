const apaService = require('../services/apaService');

const validateAssetParams = (params) => {
  const errors = [];
  
  // Fixed value validations
  if (params.authpn !== 'tataelxsi') errors.push('Invalid authpn');
  if (params.authpt !== 'vofee7ohhecai') errors.push('Invalid authpt');
  if (params.device_category !== 'stb') errors.push('Invalid device_category');
  if (params.device_model !== 'androidTV') errors.push('Invalid device_model');
  if (params.device_manufacturer !== 'ZTE') errors.push('Invalid device_manufacturer');
  if (params.api_version !== 'v5.93') errors.push('Invalid api_version');
  
  // Device type validation
  if (!['ptv', 'ott'].includes(params.device_type)) errors.push('Invalid device_type');
  
  // Required parameters validation
  if (!params.region) errors.push('region is required');
  if (!params.user_id) errors.push('user_id is required');
  if (!params.sessionKey) errors.push('sessionKey is required');
  
  // Type validation
  if (params.user_id && !Number.isInteger(Number(params.user_id))) {
    errors.push('user_id must be an integer');
  }
  
  return errors;
};

// PUBLIC_INTERFACE
const getAsset = async (req, res, next) => {
  try {
    const params = {
      authpn: req.query.authpn,
      authpt: req.query.authpt,
      device_category: req.query.device_category,
      device_type: req.query.device_type,
      device_model: req.query.device_model,
      device_manufacturer: req.query.device_manufacturer,
      api_version: req.query.api_version,
      region: req.query.region,
      user_id: req.query.user_id,
      sessionKey: req.query.sessionKey
    };

    const validationErrors = validateAssetParams(params);
    if (validationErrors.length > 0) {
      const error = new Error('Validation failed: ' + validationErrors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    const assetConfig = await apaService.getAssetConfig(params);
    res.json({ assets: assetConfig });
  } catch (error) {
    next(error);
  }
};

// PUBLIC_INTERFACE
const getMetadata = async (req, res, next) => {
  try {
    const metadata = await apaService.getMetadata();
    res.json(metadata);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAsset,
  getMetadata
};
