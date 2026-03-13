const express = require('express');
const router = express.Router();
const state = require('../data/state');

const DEFAULT_RESIDENT_ID = 'Resident-A101';

const getLeaderboard = () => {
    return [...state.sustainabilityResidents]
        .sort((a, b) => b.greenPoints - a.greenPoints || b.steps - a.steps)
        .map((resident, index) => ({
            rank: index + 1,
            residentId: resident.residentId,
            name: resident.name,
            greenPoints: resident.greenPoints,
            steps: resident.steps,
            energyGeneratedWh: Number(resident.energyGeneratedWh.toFixed(1))
        }));
};

const getOrCreateResident = (residentId) => {
    const resolvedId = residentId || DEFAULT_RESIDENT_ID;
    let resident = state.sustainabilityResidents.find((item) => item.residentId === resolvedId);

    if (!resident) {
        resident = {
            residentId: resolvedId,
            name: resolvedId,
            steps: 0,
            energyGeneratedWh: 0,
            greenPoints: 0
        };
        state.sustainabilityResidents.push(resident);
    }

    return resident;
};

const toResidentResponse = (residentId) => {
    const resident = getOrCreateResident(residentId);
    const leaderboard = getLeaderboard();
    const rankEntry = leaderboard.find((item) => item.residentId === resident.residentId);

    return {
        residentId: resident.residentId,
        name: resident.name,
        steps: resident.steps,
        energyGeneratedWh: Number(resident.energyGeneratedWh.toFixed(1)),
        greenPoints: resident.greenPoints,
        leaderboardRank: rankEntry ? rankEntry.rank : leaderboard.length
    };
};

router.get('/', (req, res) => {
    const residentId = req.query.residentId || DEFAULT_RESIDENT_ID;
    res.json(toResidentResponse(residentId));
});

router.get('/leaderboard', (req, res) => {
    res.json(getLeaderboard());
});

router.post('/add-steps', (req, res) => {
    const residentId = req.body.residentId || DEFAULT_RESIDENT_ID;
    const stepsToAdd = Number(req.body.steps);

    if (!Number.isFinite(stepsToAdd) || stepsToAdd <= 0) {
        return res.status(400).json({ message: 'steps must be a positive number' });
    }

    const resident = getOrCreateResident(residentId);

    resident.steps += Math.round(stepsToAdd);
    // 100 steps = 1.5 Wh and 2 green points.
    resident.energyGeneratedWh += (stepsToAdd / 100) * 1.5;
    resident.greenPoints += Math.round((stepsToAdd / 100) * 2);

    return res.json(toResidentResponse(residentId));
});

module.exports = router;
