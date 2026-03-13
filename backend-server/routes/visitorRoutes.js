const express = require('express');
const router = express.Router();

let visitors = [
    { id: 1, name: 'John Doe', type: 'Delivery', status: 'Expected', date: '2023-10-27', time: '14:00' },
    { id: 2, name: 'Jane Smith', type: 'Guest', status: 'Entered', date: '2023-10-27', time: '10:30' }
];

router.get('/', (req, res) => {
    res.json(visitors);
});

router.post('/', (req, res) => {
    const newVisitor = {
        id: visitors.length + 1,
        ...req.body,
        status: 'Expected'
    };
    visitors.push(newVisitor);
    res.status(201).json(newVisitor);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const visitor = visitors.find(v => v.id == id);
    if (visitor) {
        visitor.status = status;
        res.json(visitor);
    } else {
        res.status(404).json({ message: 'Visitor not found' });
    }
});

module.exports = router;
