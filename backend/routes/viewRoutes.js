const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

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

router.get('/car-list', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'cars.html'));
});

module.exports = router;