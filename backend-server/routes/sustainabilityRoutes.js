const express = require('express');
const router = express.Router();

let sustainabilityData = {
    steps: 8450,
    energyGeneratedWh: 120.5,
    greenPoints: 340,
    leaderboardRank: 5
};

router.get('/', (req, res) => {
    res.json(sustainabilityData);
});

router.post('/add-steps', (req, res) => {
    const { steps } = req.body;
    sustainabilityData.steps += steps;
    // Mock calculation: 100 steps = 1.5 Wh and 2 green points
    sustainabilityData.energyGeneratedWh += (steps / 100) * 1.5;
    sustainabilityData.greenPoints += (steps / 100) * 2;
    res.json(sustainabilityData);
});

module.exports = router;
