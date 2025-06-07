
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const Car = require('./models/car');
const carData = require('./carData');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
// Create a new car
app.post('/cars', async (req, res) => {
  try {
    const newCar = new Car(req.body);
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get one car by id
app.get('/cars/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a car by id
app.put('/cars/:id', async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCar) return res.status(404).json({ message: 'Car not found' });
    res.json(updatedCar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a car by id
app.delete('/cars/:id', async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function addAllCars() {
  try {
    const count = await Car.countDocuments();
    if (count === 0) {
      await Car.insertMany(carData);
      console.log('All cars added to MongoDB!');
    } else {
      console.log('Cars already exist in DB, skipping insert');
    }
  } catch (err) {
    console.error('Error adding cars:', err);
  }
}

// Connect to DB, add cars, then start server
connectDB()
  .then(async () => {
    console.log('MongoDB connected successfully');
    await addAllCars();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
