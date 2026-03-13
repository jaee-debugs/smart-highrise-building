const waterService = require('../services/waterService');

const getWaterLevels = async (req, res) => {
    try {
        const data = await waterService.getWaterLevels();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching water levels', error: error.message });
    }
};

module.exports = {
    getWaterLevels,
};
