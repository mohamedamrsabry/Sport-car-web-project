const Car = require('../models/car');
const path = require('path');
const { moveFolder, deleteFolder } = require('../utils/fileHelpers');

const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

const createCar = async (req, res) => {
    try {
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
};

const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });
        res.json(car);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateCar = async (req, res) => {
    try {
        const existingCar = await Car.findById(req.params.id);
        if (!existingCar) return res.status(404).json({ message: 'Car not found' });
        
        const makeModelChanged = (req.body.make !== existingCar.make || req.body.model !== existingCar.model);
        
        if (makeModelChanged && existingCar.image && !req.body.image) {
            const oldFolderName = `${existingCar.make} ${existingCar.model}`;
            const newFolderName = `${req.body.make} ${req.body.model}`;
            const productsDir = path.join(__dirname, '..', '..', 'public', 'partials', 'img', 'products');
            const oldFolderPath = path.join(productsDir, oldFolderName);
            const newFolderPath = path.join(productsDir, newFolderName);
            
            if (moveFolder(oldFolderPath, newFolderPath)) {
                const newImagePath = existingCar.image.replace(oldFolderName, newFolderName);
                req.body.image = newImagePath;
                console.log(`Moved folder from ${oldFolderName} to ${newFolderName}`);
            }
        }
        
        const updateData = {
            ...req.body,
            image: req.body.image || existingCar.image
        };
        
        const updatedCar = await Car.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedCar);
    } catch (err) {
        console.error('Update error:', err);
        res.status(400).json({ message: err.message });
    }
};

const deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: 'Car not found' });
        
        const folderName = `${car.make} ${car.model}`;
        const productsDir = path.join(__dirname, '..', '..', 'public', 'partials', 'img', 'products');
        const folderPath = path.join(productsDir, folderName);
        
        if (deleteFolder(folderPath)) {
            console.log(`Deleted folder: ${folderPath}`);
        }
        
        await Car.findByIdAndDelete(req.params.id);
        res.json({ message: 'Car and associated images deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getAllCars,
    createCar,
    getCarById,
    updateCar,
    deleteCar
};