const express = require('express');
const AssetController = require('../controllers/assetController');
const MetadataController = require('../controllers/metadataController');
const { validate } = require('../middleware/validation');
const rateLimiters = require('../middleware/rateLimit');

const router = express.Router();

// GET /apa/asset
router.get(
  '/asset',
  rateLimiters.asset,
  validate('assetConfig'),
  AssetController.getAssetConfig
);

// GET /apa/metadata
router.get(
  '/metadata',
  rateLimiters.metadata,
  validate('metadataConfig'),
  MetadataController.getMetadataConfig
);

module.exports = router;
