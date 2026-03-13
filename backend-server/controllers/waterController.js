const waterService = require('../services/waterService');

const getWaterLevels = async (req, res) => {
    try {
        const data = await waterService.getWaterLevels();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching water levels', error: error.message });
    }
};

const updateWaterLevel = async (req, res) => {
    try {
        const updated = await waterService.updateWaterLevel(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Water tank not found' });
        }
        return res.status(200).json(updated);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating water level', error: error.message });
    }
};

module.exports = {
    getWaterLevels,
    updateWaterLevel,
};
