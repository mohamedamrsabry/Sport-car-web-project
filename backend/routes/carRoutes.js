const express = require('express');
const router = express.Router();
const { getAllCars, createCar, getCarById, updateCar, deleteCar } = require('../controllers/carController');

router.get('/cars', getAllCars);
router.post('/cars', createCar);
router.get('/cars/:id', getCarById);
router.put('/cars/:id', updateCar);
router.delete('/cars/:id', deleteCar);

module.exports = router;