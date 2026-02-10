/**
 * FMS - Farm Management System
 * Backend API Server
 * Developer: Vipin Chaturvedi
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./db');

const application = express();
const SERVER_PORT = process.env.PORT || 5000;

// CORS - frontend origin se allow
application.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
application.use(express.json());

// Health check endpoint
application.get('/', (request, response) => {
  response.send('FMS API - Kisan Krishi Backend Active');
});

// Route handlers - auth, expenses, labor, stock, reports, crops
application.use('/api/auth', require('./routes/auth'));
application.use('/api/expenses', require('./routes/expenses'));
application.use('/api/labor', require('./routes/labor'));
application.use('/api/stock', require('./routes/stock'));
application.use('/api/reports', require('./routes/reports'));
application.use('/api/crops', require('./routes/crops'));

// DB connection check karke server start
database.pool
  .connect()
  .then((connection) => {
    connection.release();
    application.listen(SERVER_PORT, () => {
      console.log(`FMS Backend: http://localhost:${SERVER_PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  });
