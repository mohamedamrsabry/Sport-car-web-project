require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const Car = require('./models/car');
const carData = require('./carData');

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const viewRoutes = require('./routes/viewRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use('/', viewRoutes);
app.use('/admin', authRoutes);
app.use('/api', carRoutes);
app.use('/api', ratingRoutes);
app.use('/', uploadRoutes);

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

connectDB()
    .then(async () => {
        console.log('MongoDB connected successfully');
        await addAllCars();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });