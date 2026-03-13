const parkingService = require('../services/parkingService');

const getParkingStatus = async (req, res) => {
    try {
        const data = await parkingService.getParkingStatus();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching parking status', error: error.message });
    }
};

const updateParkingStatus = async (req, res) => {
    try {
        const updated = await parkingService.updateParkingStatus(req.params.slotId, req.body.status);
        if (!updated) {
            return res.status(404).json({ message: 'Parking slot not found' });
        }
        return res.status(200).json(updated);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating parking status', error: error.message });
    }
};

module.exports = {
    getParkingStatus,
    updateParkingStatus,
};
