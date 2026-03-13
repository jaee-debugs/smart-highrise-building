const energyService = require('../services/energyService');

const getEnergyData = async (req, res) => {
    try {
        const data = await energyService.getEnergyData();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching energy data', error: error.message });
    }
};

module.exports = {
    getEnergyData,
};
