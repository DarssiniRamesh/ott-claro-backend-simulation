const express = require('express');
const router = express.Router();
const navController = require('../controllers/navController');

router.get('/data', navController.getNavData);

module.exports = router;
