const express = require('express');
const router = express.Router();

let notices = [
    { id: 1, title: 'Annual General Meeting', date: '2023-11-01', content: 'Meeting will be held at clubhouse.' },
    { id: 2, title: 'Water Tank Cleaning', date: '2023-10-30', content: 'No water supply from 10 AM to 2 PM.' }
];

let polls = [
    { id: 1, title: 'New Gym Equipment?', options: [{ text: 'Treadmill', votes: 12 }, { text: 'Dumbbells', votes: 5 }] }
];

let events = [
    { id: 1, title: 'Diwali Celebration', date: '2023-11-12', location: 'Central Lawn' }
];

let lostFound = [
    { id: 1, item: 'Keys', description: 'Found near Tower A lobby', status: 'Unclaimed' }
];

router.get('/notices', (req, res) => res.json(notices));
router.post('/notices', (req, res) => { notices.push({ id: notices.length + 1, ...req.body }); res.status(201).json(req.body); });

router.get('/polls', (req, res) => res.json(polls));
router.get('/events', (req, res) => res.json(events));
router.get('/lost-found', (req, res) => res.json(lostFound));

module.exports = router;
