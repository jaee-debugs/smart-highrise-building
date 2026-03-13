const parkingService = require('../services/parkingService');

const getParkingStatus = async (req, res) => {
    try {
        const data = await parkingService.getParkingStatus();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching parking status', error: error.message });
    }
};

module.exports = {
    getParkingStatus,
};
