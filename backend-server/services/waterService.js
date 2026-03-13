const waterData = require('../data/waterData.json');
const WaterModel = require('../models/waterModel');

const getWaterLevels = async () => {
    // Replace this mock data with IoT sensor data here
    // Example: fetch from ESP32 / Firebase / MQTT
    return waterData.map(data => new WaterModel(data.tower, data.tankLevel));
};

module.exports = {
    getWaterLevels,
};
