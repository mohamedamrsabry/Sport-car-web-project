

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const subscribeRoute = require('./routes/subscribeRoute');

// Add this with your other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add this with your other routes
app.use('/api', subscribeRoute);

// Rest of your existing db.js code...




const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

