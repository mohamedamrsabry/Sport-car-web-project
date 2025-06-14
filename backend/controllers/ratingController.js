const Rating = require('../models/rating');

const createRating = async (req, res) => {
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
};

const getAllRatings = async (req, res) => {
    try {
        const ratings = await Rating.find().sort({ createdAt: -1 });
        res.json(ratings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteRating = async (req, res) => {
    try {
        await Rating.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rating deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createRating,
    getAllRatings,
    deleteRating
};