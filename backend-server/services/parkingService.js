const ParkingModel = require('../models/parkingModel');
const state = require('../data/state');

const getParkingStatus = async () => {
    return state.parkingSlots.map((data) => new ParkingModel(data.slotId, data.status));
};

const updateParkingStatus = async (slotId, status) => {
    const slot = state.parkingSlots.find((item) => item.slotId === slotId);
    if (!slot) {
        return null;
    }
    const allowed = ['Available', 'Occupied', 'Disabled'];
    if (allowed.includes(status)) {
        slot.status = status;
    }
    return new ParkingModel(slot.slotId, slot.status);
};

module.exports = {
    getParkingStatus,
    updateParkingStatus
};
