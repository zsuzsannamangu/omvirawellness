const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const providerRoutes = require('./routes/providers');
const bookingRoutes = require('./routes/bookings');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req: any, res: any) => {
  res.send('Omvira backend is running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
