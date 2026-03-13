const express = require('express');
const router = express.Router();

let complaints = [
    { id: 1, issue: 'Leaking Pipe', location: 'Tower A 101', status: 'Pending', reportedOn: '2023-10-26' },
    { id: 2, issue: 'Elevator sound', location: 'Tower B Lift 1', status: 'Resolved', reportedOn: '2023-10-25' }
];

router.get('/', (req, res) => {
    res.json(complaints);
});

router.post('/', (req, res) => {
    const newComplaint = {
        id: complaints.length + 1,
        ...req.body,
        status: 'Pending',
        reportedOn: new Date().toISOString().split('T')[0]
    };
    complaints.push(newComplaint);
    res.status(201).json(newComplaint);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { status, vendor } = req.body;
    let complaint = complaints.find(c => c.id == id);
    if (complaint) {
        complaint.status = status;
        if (vendor) complaint.vendor = vendor;
        res.json(complaint);
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});

module.exports = router;
