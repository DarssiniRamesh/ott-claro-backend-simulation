const express = require('express');
const UserController = require('../controllers/userController');
const { validate } = require('../middleware/validation');
const rateLimiters = require('../middleware/rateLimit');

const router = express.Router();

// GET /user/startheaderinfo
router.get(
  '/startheaderinfo',
  rateLimiters.userStartHeader,
  validate('userStartHeader'),
  UserController.startHeaderInfo
);

module.exports = router;
