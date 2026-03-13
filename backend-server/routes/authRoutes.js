const express = require('express');
const router = express.Router();

// Mock Auth
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Simple mock logic
    if (username === 'admin' && password === 'admin') {
        return res.json({ role: 'Admin', token: 'mock-admin-token', user: { name: 'Admin User' } });
    } else if (username === 'resident' && password === 'resident') {
        return res.json({ role: 'Resident', token: 'mock-resident-token', user: { name: 'Resident User', tower: 'A', flat: '101' } });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
