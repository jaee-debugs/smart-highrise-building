const express = require('express');
const router = express.Router();
const state = require('../data/state');

router.get('/', (req, res) => {
  res.json(state.evStations);
});

router.post('/book', (req, res) => {
  const { stationId, user } = req.body;
  const station = state.evStations.find((item) => item.id === stationId);

  if (!station || station.status !== 'Available') {
    return res.status(400).json({ message: 'Station not available' });
  }

  station.status = 'Occupied';
  station.currentBooking = user || 'Resident';
  return res.json({ message: 'Station booked', station });
});

router.put('/:id', (req, res) => {
  const station = state.evStations.find((item) => item.id === req.params.id);
  if (!station) {
    return res.status(404).json({ message: 'Station not found' });
  }

  const allowed = ['Available', 'Occupied', 'Maintenance'];
  if (req.body.status && allowed.includes(req.body.status)) {
    station.status = req.body.status;
  }

  if (station.status === 'Available') {
    station.currentBooking = null;
  } else if (typeof req.body.currentBooking === 'string') {
    station.currentBooking = req.body.currentBooking;
  }

  return res.json(station);
});

router.post('/reset', (req, res) => {
  state.evStations.forEach((item) => {
    item.status = 'Available';
    item.currentBooking = null;
  });
  res.json({ message: 'All stations reset', stations: state.evStations });
});

module.exports = router;
