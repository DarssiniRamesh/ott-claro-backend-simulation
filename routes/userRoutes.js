const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/startheaderinfo', userController.startHeaderInfo);

module.exports = router;
