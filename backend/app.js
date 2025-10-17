const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Primary API router
app.use('/api', require('./router'));

// Specific routes (explicit mounts)
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/reports', require('./routes/report.routes'));

module.exports = app;



