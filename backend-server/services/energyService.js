const energyData = require('../data/energyData.json');
const EnergyModel = require('../models/energyModel');

const getEnergyData = async () => {
    // Replace this mock data with IoT sensor data here
    // Example: fetch from ESP32 / Firebase / MQTT
    return new EnergyModel(energyData.steps, energyData.energyGenerated, energyData.greenPoints);
};

module.exports = {
    getEnergyData,
};
