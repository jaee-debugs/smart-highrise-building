const parkingData = require('../data/parkingData.json');
const ParkingModel = require('../models/parkingModel');

const getParkingStatus = async () => {
    // Replace this mock data with IoT sensor data here
    // Example: fetch from ESP32 / Firebase / MQTT
    return parkingData.map(data => new ParkingModel(data.slotId, data.status));
};

module.exports = {
    getParkingStatus,
};
