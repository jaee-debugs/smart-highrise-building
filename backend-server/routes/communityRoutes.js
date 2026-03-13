const express = require('express');
const router = express.Router();
const state = require('../data/state');

router.get('/', (req, res) => {
  res.json(state.community);
});

router.get('/notices', (req, res) => res.json(state.community.notices));
router.post('/notices', (req, res) => {
  const notice = { id: state.nextId(state.community.notices), ...req.body };
  state.community.notices.unshift(notice);
  res.status(201).json(notice);
});
router.put('/notices/:id', (req, res) => {
  const notice = state.community.notices.find((item) => item.id === Number(req.params.id));
  if (!notice) {
    return res.status(404).json({ message: 'Notice not found' });
  }
  Object.assign(notice, req.body);
  return res.json(notice);
});

router.get('/polls', (req, res) => res.json(state.community.polls));
router.post('/polls', (req, res) => {
  const options = Array.isArray(req.body.options)
    ? req.body.options
        .map((item) => {
          if (typeof item === 'string') {
            return item.trim();
          }
          if (item && typeof item.text === 'string') {
            return item.text.trim();
          }
          return '';
        })
        .filter(Boolean)
        .map((text) => ({ text, votes: 0 }))
    : [];

  if (!req.body.title || !String(req.body.title).trim()) {
    return res.status(400).json({ message: 'Poll title is required' });
  }

  if (options.length < 2) {
    return res.status(400).json({ message: 'At least 2 poll options are required' });
  }

  const poll = { id: state.nextId(state.community.polls), title: String(req.body.title).trim(), options, voters: [] };
  state.community.polls.unshift(poll);
  res.status(201).json(poll);
});
router.post('/polls/:id/vote', (req, res) => {
  const poll = state.community.polls.find((item) => item.id === Number(req.params.id));
  if (!poll) {
    return res.status(404).json({ message: 'Poll not found' });
  }

  const optionIndex = Number(req.body.optionIndex);
  const voterId = String(req.body.voterId || 'resident').trim();
  if (Number.isNaN(optionIndex) || optionIndex < 0 || optionIndex >= poll.options.length) {
    return res.status(400).json({ message: 'Invalid option index' });
  }

  if (!Array.isArray(poll.voters)) {
    poll.voters = [];
  }

  if (poll.voters.includes(voterId)) {
    return res.status(400).json({ message: 'Resident already voted for this poll' });
  }

  poll.options[optionIndex].votes += 1;
  poll.voters.push(voterId);
  return res.json(poll);
});
router.put('/polls/:id', (req, res) => {
  const poll = state.community.polls.find((item) => item.id === Number(req.params.id));
  if (!poll) {
    return res.status(404).json({ message: 'Poll not found' });
  }
  Object.assign(poll, req.body);
  return res.json(poll);
});

router.get('/events', (req, res) => res.json(state.community.events));
router.post('/events', (req, res) => {
  const event = { id: state.nextId(state.community.events), ...req.body };
  state.community.events.unshift(event);
  res.status(201).json(event);
});
router.put('/events/:id', (req, res) => {
  const event = state.community.events.find((item) => item.id === Number(req.params.id));
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  Object.assign(event, req.body);
  return res.json(event);
});

router.get('/lost-found', (req, res) => res.json(state.community.lostFound));
router.get('/lost-found/public', (req, res) => {
  const visible = state.community.lostFound.filter((item) => item.status === 'Approved');
  return res.json(visible);
});
router.post('/lost-found', (req, res) => {
  const item = {
    id: state.nextId(state.community.lostFound),
    status: 'PendingApproval',
    createdBy: req.body.createdBy || 'Resident',
    ...req.body
  };
  state.community.lostFound.unshift(item);
  res.status(201).json(item);
});
router.put('/lost-found/:id/approve', (req, res) => {
  const item = state.community.lostFound.find((entry) => entry.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Lost & Found post not found' });
  }
  item.status = 'Approved';
  return res.json(item);
});
router.put('/lost-found/:id/close', (req, res) => {
  const item = state.community.lostFound.find((entry) => entry.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Lost & Found post not found' });
  }
  item.status = 'Closed';
  return res.json(item);
});
router.delete('/lost-found/:id', (req, res) => {
  const index = state.community.lostFound.findIndex((entry) => entry.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Lost & Found post not found' });
  }
  state.community.lostFound.splice(index, 1);
  return res.status(204).send();
});

module.exports = router;
