const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối DB
connectDB();

// Routes
const customerRoutes = require('./routes/customerRoutes');
const eventTypeRoutes = require('./routes/eventTypeRoutes');
const contractRoutes = require('./routes/contractRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/customers', customerRoutes);
app.use('/api/event-types', eventTypeRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('Event Management API'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));