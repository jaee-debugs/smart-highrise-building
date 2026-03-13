const express = require('express');
const router = express.Router();
const state = require('../data/state');

const getWaterSummary = () => {
  const tanks = state.waterTanks.map((tank) => ({
    id: tank.id,
    tower: tank.tower,
    floor: tank.floor,
    tankName: tank.tankName,
    level: tank.level,
    status: state.getWaterStatus(tank.level)
  }));

  const lowCount = tanks.filter((item) => item.status === 'Low').length;
  const criticalCount = tanks.filter((item) => item.status === 'Critical').length;

  return {
    tanks,
    summary: {
      normal: tanks.length - lowCount - criticalCount,
      low: lowCount,
      critical: criticalCount
    }
  };
};

router.get('/infra', (req, res) => {
  const water = getWaterSummary();
  const power = {
    currentConsumptionKw: state.infra.powerConsumptionKw,
    towerConsumptionKwh: state.energy.towerConsumptionKwh
  };

  res.json({
    water,
    power,
    generator: state.infra.generator,
    lifts: state.infra.lifts,
    fireSystem: state.infra.fireSystem,
    alerts: {
      liftAlerts: state.infra.lifts.filter((item) => item.health !== 'Healthy'),
      fireAlerts: state.infra.fireSystem.filter((item) => item.severity !== 'Normal')
    }
  });
});

router.put('/infra/generator', (req, res) => {
  state.infra.generator = { ...state.infra.generator, ...req.body };
  res.json(state.infra.generator);
});

router.put('/infra/fire/:id', (req, res) => {
  const alert = state.infra.fireSystem.find((item) => item.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ message: 'Fire alert not found' });
  }
  Object.assign(alert, req.body);
  return res.json(alert);
});

router.put('/infra/lift/:id', (req, res) => {
  const lift = state.infra.lifts.find((item) => item.id === req.params.id);
  if (!lift) {
    return res.status(404).json({ message: 'Lift not found' });
  }
  Object.assign(lift, req.body);
  return res.json(lift);
});

router.post('/emergency', (req, res) => {
  const emergency = {
    id: state.nextId(state.emergencies),
    residentName: req.body.residentName || 'Resident',
    tower: req.body.tower || 'Unknown Tower',
    floor: req.body.floor || 'Unknown Floor',
    flat: req.body.flat || 'Unknown Flat',
    location: req.body.location || `${req.body.tower || 'Unknown'} ${req.body.flat || ''}`.trim(),
    createdAt: new Date().toISOString(),
    resolved: false
  };

  state.emergencies.unshift(emergency);
  return res.status(201).json(emergency);
});

router.get('/emergencies', (req, res) => {
  const sinceId = Number(req.query.sinceId || 0);
  const data = state.emergencies.filter((event) => event.id > sinceId);
  res.json({ events: data, latestId: state.emergencies[0]?.id || 0 });
});

router.put('/emergencies/:id/resolve', (req, res) => {
  const event = state.emergencies.find((item) => item.id === Number(req.params.id));
  if (!event) {
    return res.status(404).json({ message: 'Emergency event not found' });
  }
  event.resolved = true;
  return res.json(event);
});

module.exports = router;
