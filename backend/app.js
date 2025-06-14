require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const Car = require('./models/car');
const Contact = require('./models/contact');
const carData = require('./carData');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Rating = require('./models/rating');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ensure the products directory exists
const productsDir = path.join(__dirname, '..', 'public', 'partials', 'img', 'products');
if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const make = req.body.make;
        const model = req.body.model;
        const folderName = `${make} ${model}`;
        const folderPath = path.join(productsDir, folderName);
        
        // Create folder if it doesn't exist
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const make = req.body.make;
        const model = req.body.model;
        const folderName = `${make} ${model}`;
        
        // Get the current file count to determine the filename
        const folderPath = path.join(productsDir, folderName);
        const files = fs.readdirSync(folderPath).filter(f => f.match(/\.(jpg|jpeg|png|gif)$/i));
        
        let filename;
        if (files.length === 0) {
            // First image gets the folder name
            filename = `${folderName}${path.extname(file.originalname)}`;
        } else {
            // Other images get A, B, C
            const letters = ['A', 'B', 'C'];
            filename = `${letters[files.length - 1]}${path.extname(file.originalname)}`;
        }
        
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const htmlPages = [
    'about',
    'admin',
    'privacy',
    'products',
    'quota',
    'terms',
    'car-list'
];

htmlPages.forEach(page => {
    const ext = page === 'admin' ? '.html' : '.html';
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', `${page}${ext}`));
    });
});

app.get('/car-list', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'cars.html'));
});

// Image upload endpoint
app.post('/upload-images', upload.array('images', 4), (req, res) => {
    try {
        if (!req.files || req.files.length !== 4) {
            return res.status(400).json({ message: 'Please upload exactly 4 images' });
        }

        const make = req.body.make;
        const model = req.body.model;
        const folderName = `${make} ${model}`;
        
        // Return the path to the main image
        const mainImagePath = `/partials/img/products/${folderName}/${folderName}${path.extname(req.files[0].originalname)}`;
        
        res.json({
            message: 'Images uploaded successfully',
            mainImagePath: mainImagePath,
            folderPath: `/partials/img/products/${folderName}/`,
            uploadedFiles: req.files.map(file => file.filename)
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading images: ' + error.message });
    }
});

// Get all cars
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
        // Check if ID already exists
        const existingCar = await Car.findOne({ id: req.body.id });
        if (existingCar) {
            return res.status(400).json({ message: 'Car with this ID already exists' });
        }

        const newCar = new Car(req.body);
        const savedCar = await newCar.save();
        res.status(201).json(savedCar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all ratings (for admin)
app.get('/ratings', async (req, res) => {
    try {
        const ratings = await Rating.find().sort({ createdAt: -1 });
        res.json(ratings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a rating
app.delete('/ratings/:id', async (req, res) => {
    try {
        await Rating.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rating deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
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
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });
        
        // Delete the car's image folder
        const folderName = `${car.make} ${car.model}`;
        const folderPath = path.join(productsDir, folderName);
        
        if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true, force: true });
            console.log(`Deleted folder: ${folderPath}`);
        }
        
        const deletedCar = await Car.findByIdAndDelete(req.params.id);
        res.json({ message: 'Car and associated images deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message, carOfInterest } = req.body;
        
        // Basic validation
        if (!firstName || !lastName || !email || !phone || !message) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const contact = new Contact({
            firstName,
            lastName,
            email,
            phone,
            message,
            carOfInterest
        });

        await contact.save();
        res.status(201).json({ message: 'Contact form submitted successfully' });
    } catch (err) {
        console.error('Contact submission error:', err);
        res.status(500).json({ message: 'Error submitting contact form' });
    }
});

// Get all contact submissions (admin only)
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching contacts' });
    }
});

// Update contact status (admin only)
app.put('/api/contacts/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        
        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: 'Error updating contact status' });
    }
});

// Rate Us endpoint
app.post('/api/rate', async (req, res) => {
    try {
        const { name, rating, message } = req.body;
        if (!name || !rating) {
            return res.status(400).json({ message: 'Name and rating are required.' });
        }
        if (isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
        }
        const newRating = new Rating({ name, rating, message });
        await newRating.save();
        res.status(201).json({ message: 'Thank you for your rating!' });
    } catch (err) {
        console.error('Rating submission error:', err);
        res.status(500).json({ message: 'Error submitting rating.' });
    }
});
// Rate Us endpoint
app.post('/api/rate', async (req, res) => {
    try {
        const { name, rating, message } = req.body;
        if (!name || !rating) {
            return res.status(400).json({ message: 'Name and rating are required.' });
        }
        if (isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
        }
        const newRating = new Rating({ name, rating, message });
        await newRating.save();
        res.status(201).json({ message: 'Thank you for your rating!' });
    } catch (err) {
        console.error('Rating submission error:', err);
        res.status(500).json({ message: 'Error submitting rating.' });
    }
});

// Get all ratings (for admin)
app.get('/ratings', async (req, res) => {
    try {
        const ratings = await Rating.find().sort({ createdAt: -1 });
        res.json(ratings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a rating
app.delete('/ratings/:id', async (req, res) => {
    try {
        await Rating.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rating deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
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


connectDB()
    .then(async () => {
        console.log('MongoDB connected successfully');
        await addAllCars();
        app.listen(PORT,'0.0.0.0', () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });