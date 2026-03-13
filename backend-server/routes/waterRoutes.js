const express = require('express');
const router = express.Router();
const waterController = require('../controllers/waterController');

router.get('/', waterController.getWaterLevels);

module.exports = router;
