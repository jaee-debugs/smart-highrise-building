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
  const visitorId = `VIS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const createdAt = new Date().toISOString();
  const validUntil = req.body.validUntil || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

  const pass = {
    id: state.nextId(state.visitorPasses),
    visitorId,
    passToken,
    visitorName: req.body.visitorName,
    tower: req.body.tower,
    flat: req.body.flat,
    residentFlat: req.body.flat,
    visitTime: req.body.visitTime || createdAt,
    validFrom: createdAt,
    validUntil,
    status: 'PreApproved',
    checkedInAt: null,
    createdBy: req.body.createdBy || 'Resident',
    used: false
  };

  pass.qrPayload = JSON.stringify({
    passToken: pass.passToken,
    visitorId: pass.visitorId,
    visitorName: pass.visitorName,
    residentFlat: pass.residentFlat,
    tower: pass.tower,
    visitTime: pass.visitTime,
    validUntil: pass.validUntil
  });

  state.visitorPasses.unshift(pass);
  res.status(201).json(pass);
});

router.get('/passes', (req, res) => {
  res.json(state.visitorPasses);
});

router.post('/verify', (req, res) => {
  const rawQrData = req.body.qrData;
  const inputToken = req.body.passToken;

  let decoded = null;
  if (typeof rawQrData === 'string') {
    try {
      decoded = JSON.parse(rawQrData);
    } catch (error) {
      decoded = null;
    }
  } else if (rawQrData && typeof rawQrData === 'object') {
    decoded = rawQrData;
  }

  const token = String(inputToken || decoded?.passToken || '').trim();
  const qrVisitorId = String(decoded?.visitorId || '').trim();

  const denyMessage = 'Entry Denied - Invalid QR Code';

  if (!token) {
    return res.status(400).json({ verified: false, message: denyMessage, reason: 'Missing visitor token' });
  }

  if (state.blockedEntries.includes(token)) {
    const log = {
      id: state.nextId(state.visitorEntryLogs),
      token,
      visitorId: qrVisitorId || null,
      status: 'Blocked',
      reason: 'Token is blocked',
      timestamp: new Date().toISOString()
    };
    state.visitorEntryLogs.unshift(log);
    return res.status(403).json({ verified: false, message: denyMessage, reason: 'Token is blocked', log });
  }

  const pass = state.visitorPasses.find((item) => item.passToken === token || (qrVisitorId && item.visitorId === qrVisitorId));
  if (!pass) {
    const log = {
      id: state.nextId(state.visitorEntryLogs),
      token,
      visitorId: qrVisitorId || null,
      status: 'Unauthorized',
      reason: 'Invalid token',
      timestamp: new Date().toISOString()
    };
    state.visitorEntryLogs.unshift(log);
    return res.status(404).json({ verified: false, message: denyMessage, reason: 'Invalid QR code', log });
  }

  const now = Date.now();
  const validFromTs = Date.parse(pass.validFrom || pass.visitTime || pass.createdAt || new Date().toISOString());
  const validUntilTs = Date.parse(pass.validUntil);

  if (pass.used || pass.status === 'Checked In') {
    const log = {
      id: state.nextId(state.visitorEntryLogs),
      token: pass.passToken,
      visitorId: pass.visitorId,
      visitorName: pass.visitorName,
      tower: pass.tower,
      flat: pass.flat,
      status: 'Denied',
      reason: 'Pass already used',
      timestamp: new Date().toISOString()
    };
    state.visitorEntryLogs.unshift(log);
    return res.status(409).json({ verified: false, message: denyMessage, reason: 'Pass already used', pass, log });
  }

  if (pass.status !== 'PreApproved') {
    const log = {
      id: state.nextId(state.visitorEntryLogs),
      token: pass.passToken,
      visitorId: pass.visitorId,
      visitorName: pass.visitorName,
      tower: pass.tower,
      flat: pass.flat,
      status: 'Denied',
      reason: 'Pass is not pre-approved',
      timestamp: new Date().toISOString()
    };
    state.visitorEntryLogs.unshift(log);
    return res.status(403).json({ verified: false, message: denyMessage, reason: 'Pass is not pre-approved', pass, log });
  }

  if (!Number.isNaN(validFromTs) && now < validFromTs) {
    const log = {
      id: state.nextId(state.visitorEntryLogs),
      token: pass.passToken,
      visitorId: pass.visitorId,
      visitorName: pass.visitorName,
      tower: pass.tower,
      flat: pass.flat,
      status: 'Denied',
      reason: 'Pass not active yet',
      timestamp: new Date().toISOString()
    };
    state.visitorEntryLogs.unshift(log);
    return res.status(400).json({ verified: false, message: denyMessage, reason: 'Pass not active yet', pass, log });
  }

  if (Number.isNaN(validUntilTs) || now > validUntilTs) {
    const log = {
      id: state.nextId(state.visitorEntryLogs),
      token: pass.passToken,
      visitorId: pass.visitorId,
      visitorName: pass.visitorName,
      tower: pass.tower,
      flat: pass.flat,
      status: 'Denied',
      reason: 'Pass expired',
      timestamp: new Date().toISOString()
    };
    state.visitorEntryLogs.unshift(log);
    pass.status = 'Expired';
    return res.status(400).json({ verified: false, message: denyMessage, reason: 'Pass expired', pass, log });
  }

  // Default successful scan behavior is automatic approval and check-in.
  pass.status = 'Checked In';
  pass.used = true;
  pass.checkedInAt = new Date().toISOString();

  const log = {
    id: state.nextId(state.visitorEntryLogs),
    token: pass.passToken,
    visitorId: pass.visitorId,
    visitorName: pass.visitorName,
    tower: pass.tower,
    flat: pass.flat,
    status: 'Checked In',
    reason: 'Entry auto-approved after successful verification',
    timestamp: pass.checkedInAt
  };
  state.visitorEntryLogs.unshift(log);

  return res.json({ verified: true, autoApproved: true, message: 'Entry Granted', pass, log });
});

router.put('/passes/:id/decision', (req, res) => {
  const pass = state.visitorPasses.find((item) => item.id === Number(req.params.id));
  if (!pass) {
    return res.status(404).json({ message: 'Pass not found' });
  }

  const decision = req.body.decision;
  if (decision === 'approve') {
    pass.status = 'Checked In';
    pass.used = true;
    pass.checkedInAt = new Date().toISOString();
  } else if (decision === 'reject') {
    pass.status = 'Rejected';
  }

  state.visitorEntryLogs.unshift({
    id: state.nextId(state.visitorEntryLogs),
    token: pass.passToken,
    visitorName: pass.visitorName,
    visitorId: pass.visitorId,
    tower: pass.tower,
    flat: pass.flat,
    status: pass.status === 'Checked In' ? 'Checked In' : 'Denied',
    reason: decision === 'approve' ? 'Manually approved by admin' : 'Manually rejected by admin',
    timestamp: new Date().toISOString()
  });

  return res.json(pass);
});

module.exports = router;
