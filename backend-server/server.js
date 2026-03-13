const express = require('express');
const cors = require('cors');

const parkingRoutes = require('./routes/parkingRoutes');
const waterRoutes = require('./routes/waterRoutes');
const energyRoutes = require('./routes/energyRoutes');
const authRoutes = require('./routes/authRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const communityRoutes = require('./routes/communityRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const chargingRoutes = require('./routes/chargingRoutes');
const sustainabilityRoutes = require('./routes/sustainabilityRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/parking', parkingRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/visitor', visitorRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/charging', chargingRoutes);
app.use('/api/sustainability', sustainabilityRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
