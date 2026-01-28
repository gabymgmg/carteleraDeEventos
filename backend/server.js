require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to receive JSON data

// Simple Smoke Test Route
app.get('/', (req, res) => {
  res.send('Cartelera de eventos API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));