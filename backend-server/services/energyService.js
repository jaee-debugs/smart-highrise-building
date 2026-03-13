const EnergyModel = require('../models/energyModel');
const state = require('../data/state');

const getEnergyData = async () => {
    return {
        overview: {
            ...new EnergyModel(
                state.energy.dailyTrend.reduce((acc, item) => acc + item.generated, 0),
                `${state.energy.totalPiezoEnergyKwh} kWh`,
                state.energy.greenPoints
            ),
            totalPiezoEnergyKwh: state.energy.totalPiezoEnergyKwh
        },
        towerConsumptionKwh: state.energy.towerConsumptionKwh,
        dailyTrend: state.energy.dailyTrend,
        monthlyTrend: state.energy.monthlyTrend
    };
};

module.exports = {
    getEnergyData,
};
