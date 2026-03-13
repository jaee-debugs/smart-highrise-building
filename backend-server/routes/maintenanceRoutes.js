const express = require('express');
const router = express.Router();
const state = require('../data/state');

router.get('/', (req, res) => {
  res.json(state.maintenanceRequests);
});

router.post('/', (req, res) => {
  const newRequest = {
    id: state.nextId(state.maintenanceRequests),
    issue: req.body.issue,
    location: req.body.location,
    requestedBy: req.body.requestedBy || 'Resident',
    status: 'Pending',
    reportedOn: new Date().toISOString().split('T')[0]
  };
  state.maintenanceRequests.unshift(newRequest);
  res.status(201).json(newRequest);
});

router.put('/:id', (req, res) => {
  const request = state.maintenanceRequests.find((item) => item.id === Number(req.params.id));
  if (!request) {
    return res.status(404).json({ message: 'Maintenance request not found' });
  }

  const allowed = ['Pending', 'In Progress', 'Resolved'];
  if (req.body.status && allowed.includes(req.body.status)) {
    request.status = req.body.status;
  }

  if (req.body.vendor) {
    request.vendor = req.body.vendor;
  }

  return res.json(request);
});

module.exports = router;
