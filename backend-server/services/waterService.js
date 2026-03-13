const state = require('../data/state');
const WaterModel = require('../models/waterModel');

const getWaterLevels = async () => {
    return state.waterTanks.map((tank) => ({
        ...new WaterModel(tank.tower, tank.level),
        id: tank.id,
        floor: tank.floor,
        tankName: tank.tankName,
        status: state.getWaterStatus(tank.level)
    }));
};

const updateWaterLevel = async (id, payload) => {
    const tank = state.waterTanks.find((item) => item.id === id);
    if (!tank) {
        return null;
    }

    const nextLevel = Number(payload.level);
    if (!Number.isNaN(nextLevel)) {
        tank.level = Math.min(100, Math.max(0, nextLevel));
    }

    if (payload.tankName) {
        tank.tankName = payload.tankName;
    }

    return {
        ...new WaterModel(tank.tower, tank.level),
        id: tank.id,
        floor: tank.floor,
        tankName: tank.tankName,
        status: state.getWaterStatus(tank.level)
    };
};

module.exports = {
    getWaterLevels,
    updateWaterLevel
};
