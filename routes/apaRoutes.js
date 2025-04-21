const express = require('express');
const router = express.Router();
const apaController = require('../controllers/apaController');

router.get('/asset', apaController.getAsset);
router.get('/metadata', apaController.getMetadata);

module.exports = router;
