const express = require('express');
const router = express.Router();
const { createRating, getAllRatings, deleteRating } = require('../controllers/ratingController');

router.post('/rate', createRating);
router.get('/ratings', getAllRatings);
router.delete('/ratings/:id', deleteRating);

module.exports = router;