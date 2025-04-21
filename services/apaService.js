const dbService = require('./dbService');

// PUBLIC_INTERFACE
const getAssetConfig = async (params) => {
  const db = dbService.readData();
  const assetConfig = db.assets.find(asset => asset.deviceType === params.device_type) || 
                     db.assets.find(asset => asset.id === 'default');
  
  if (!assetConfig) {
    const error = new Error('Asset configuration not found');
    error.statusCode = 404;
    throw error;
  }

  // Convert to key-value pairs format
  return Object.entries(assetConfig.config || {}).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
};

// PUBLIC_INTERFACE
// PUBLIC_INTERFACE
const getMetadata = async (params) => {
  const db = dbService.readData();
  const metadata = db.metadata || {};

  // Define output parameters with their types
  const outputParams = {
    translations: { type: 'object' },
    sprites_configuration: { type: 'object' },
    atv_hide_pack_logo: { type: 'boolean' },
    third_party_epg_apps: { type: 'array' },
    logs_dashboard_url: { type: 'string' },
    lms_bootstrap_url: { type: 'string' },
    byr_filterlist_configuration: { type: 'object' },
    time_to_get_favs: { type: 'number' },
    sentinel_reminders_interval: { type: 'number' },
    pin_use_channel_rating_flow: { type: 'boolean' },
    time_to_get_recordings: { type: 'number' },
    onboarding: { type: 'object' },
    interval_time_check_epg_version: { type: 'number' },
    interval_time_check_lineal_channels: { type: 'number' },
    fast_forward_rewind_option: { type: 'object' },
    supported_stream: { type: 'array' },
    isloggedin_refresh_hours_time: { type: 'number' },
    atv_max_buffer_ms: { type: 'number' },
    atv_min_buffer_ms: { type: 'number' },
    atv_rebuffer_ms: { type: 'number' },
    atv_start_buffer_ms: { type: 'number' },
    myaccount_configuration: { type: 'object' },
    fallback_interval_time: { type: 'number' }
  };

  // Initialize missing parameters with null and ensure correct types
  const result = {};
  Object.entries(outputParams).forEach(([param, config]) => {
    result[param] = param in metadata ? metadata[param] : null;
  });

  return result;
};

module.exports = {
  getAssetConfig,
  getMetadata
};
