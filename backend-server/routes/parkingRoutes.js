const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

router.get('/', parkingController.getParkingStatus);
router.put('/:slotId', parkingController.updateParkingStatus);

module.exports = router;
