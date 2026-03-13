const express = require('express');
const cors = require('cors');

const parkingRoutes = require('./routes/parkingRoutes');
const waterRoutes = require('./routes/waterRoutes');
const energyRoutes = require('./routes/energyRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/parking', parkingRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/energy', energyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
