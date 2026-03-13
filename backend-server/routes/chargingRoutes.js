const express = require('express');
const router = express.Router();

let chargingSlots = [
    { id: 'EV1', status: 'available', currentBooking: null },
    { id: 'EV2', status: 'charging', currentBooking: 'Resident-A101' },
    { id: 'EV3', status: 'available', currentBooking: null }
];

router.get('/', (req, res) => {
    res.json(chargingSlots);
});

router.post('/book', (req, res) => {
    const { slotId, user } = req.body;
    let slot = chargingSlots.find(s => s.id === slotId);
    if (slot && slot.status === 'available') {
        slot.status = 'booked';
        slot.currentBooking = user;
        res.json({ message: 'Slot booked successfully', slot });
    } else {
        res.status(400).json({ message: 'Slot not available' });
    }
});

router.put('/:id', (req, res) => { // Admin override
    const { id } = req.params;
    const { status } = req.body;
    let slot = chargingSlots.find(s => s.id === id);
    if (slot) {
        slot.status = status;
        if (status === 'available') slot.currentBooking = null;
        res.json(slot);
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});

module.exports = router;
