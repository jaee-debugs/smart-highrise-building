const express = require('express');
const router = express.Router();

// Mock Auth
router.post('/login', (req, res) => {
    const rawUsername = String(req.body?.username || '').trim();
    const rawPassword = String(req.body?.password || '').trim();
    const username = rawUsername.toLowerCase();
    const password = rawPassword.toLowerCase();

    // Allow flexible demo credentials for easier mobile testing.
    const isAdmin = username === 'admin' && password === 'admin';
    const isResident =
        (username === 'resident' && password === 'resident') ||
        (username === 'resident-a101' && password === 'resident') ||
        (username === 'resident a101' && password === 'resident');

    if (isAdmin) {
        return res.json({ role: 'Admin', token: 'mock-admin-token', user: { name: 'Admin User' } });
    } else if (isResident) {
        return res.json({ role: 'Resident', token: 'mock-resident-token', user: { name: 'Resident User', tower: 'A', flat: '101' } });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
