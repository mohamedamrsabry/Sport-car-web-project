const express = require('express');
const router = express.Router();
const path = require('path');

// Home route
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

// HTML pages
const htmlPages = [
    'about',
    'admin',
    'privacy',
    'products',
    'quota',
    'terms'
];

htmlPages.forEach(page => {
    router.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'public', `${page}.html`));
    });
});

// Special route for car-list
router.get('/car-list', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'cars.html'));
});

module.exports = router;