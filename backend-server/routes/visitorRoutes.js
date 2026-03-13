const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const state = require('../data/state');

router.get('/', (req, res) => {
  res.json(state.visitors);
});

router.post('/', (req, res) => {
  const newVisitor = {
    id: state.nextId(state.visitors),
    ...req.body,
    status: 'Expected'
  };
  state.visitors.unshift(newVisitor);
  res.status(201).json(newVisitor);
});

router.put('/:id', (req, res) => {
  const visitor = state.visitors.find((item) => item.id === Number(req.params.id));
  if (!visitor) {
    return res.status(404).json({ message: 'Visitor not found' });
  }
  Object.assign(visitor, req.body);
  return res.json(visitor);
});

router.get('/cctv', (req, res) => {
  res.json(state.cctvCameras);
});

router.get('/entry-logs', (req, res) => {
  res.json(state.visitorEntryLogs);
});

router.post('/block', (req, res) => {
  const token = String(req.body.token || '').trim();
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  if (!state.blockedEntries.includes(token)) {
    state.blockedEntries.push(token);
  }

  state.visitorEntryLogs.unshift({
    id: state.nextId(state.visitorEntryLogs),
    token,
    status: 'Blocked',
    reason: req.body.reason || 'Unauthorized entry attempt',
    timestamp: new Date().toISOString()
  });

  return res.status(201).json({ token, status: 'Blocked' });
});

router.post('/passes', (req, res) => {
  const passToken = crypto.randomBytes(8).toString('hex');
  const pass = {
    id: state.nextId(state.visitorPasses),
    passToken,
    visitorName: req.body.visitorName,
    tower: req.body.tower,
    flat: req.body.flat,
    validUntil: req.body.validUntil,
    status: 'Pending'
  };
  state.visitorPasses.unshift(pass);
  res.status(201).json(pass);
});

router.get('/passes', (req, res) => {
  res.json(state.visitorPasses);
});

router.post('/verify', (req, res) => {
  const { passToken } = req.body;
  const token = String(passToken || '').trim();

  if (state.blockedEntries.includes(token)) {
    const log = {
      id: state.nextId(state.visitorEntryLogs),
      token,
      status: 'Blocked',
      reason: 'Token is blocked',
      timestamp: new Date().toISOString()
    };
    state.visitorEntryLogs.unshift(log);
    return res.status(403).json({ verified: false, message: 'Token is blocked', log });
  }

  const pass = state.visitorPasses.find((item) => item.passToken === token);
  if (!pass) {
    const log = {
      id: state.nextId(state.visitorEntryLogs),
      token,
      status: 'Unauthorized',
      reason: 'Invalid token',
      timestamp: new Date().toISOString()
    };
    state.visitorEntryLogs.unshift(log);
    return res.status(404).json({ verified: false, message: 'Invalid pass token', log });
  }

  pass.status = 'Scanned';
  return res.json({ verified: true, pendingDecision: true, pass });
});

router.put('/passes/:id/decision', (req, res) => {
  const pass = state.visitorPasses.find((item) => item.id === Number(req.params.id));
  if (!pass) {
    return res.status(404).json({ message: 'Pass not found' });
  }

  const decision = req.body.decision;
  if (decision === 'approve') {
    pass.status = 'Verified';
  } else if (decision === 'reject') {
    pass.status = 'Rejected';
  }

  state.visitorEntryLogs.unshift({
    id: state.nextId(state.visitorEntryLogs),
    token: pass.passToken,
    visitorName: pass.visitorName,
    tower: pass.tower,
    flat: pass.flat,
    status: pass.status,
    reason: decision === 'approve' ? 'Approved by admin' : 'Rejected by admin',
    timestamp: new Date().toISOString()
  });

  return res.json(pass);
});

module.exports = router;
