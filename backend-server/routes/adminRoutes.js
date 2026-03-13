const express = require('express');
const router = express.Router();

let infraStatus = {
    water: {
        TowerA: { level: 85, status: 'Normal' },
        TowerB: { level: 30, status: 'Low' }
    },
    generator: { status: 'Standby', fuel: '75%' },
    lifts: [
        { id: 'T-A-L1', status: 'Operational' },
        { id: 'T-A-L2', status: 'Maintenance' },
        { id: 'T-B-L1', status: 'Operational' }
    ],
    fire: { status: 'Normal', lastChecked: '2023-10-01' }
};

router.get('/infra', (req, res) => {
    res.json(infraStatus);
});

router.put('/infra', (req, res) => {
    const { type, data } = req.body;
    if (infraStatus[type]) {
        infraStatus[type] = { ...infraStatus[type], ...data };
        res.json(infraStatus[type]);
    } else {
        res.status(400).json({ message: 'Invalid infra type' });
    }
});

// Update particular lift
router.put('/infra/lift/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    let lift = infraStatus.lifts.find(l => l.id === id);
    if (lift) {
        lift.status = status;
        res.json(lift);
    } else {
        res.status(404).json({ message: 'Lift not found' });
    }
});

module.exports = router;
