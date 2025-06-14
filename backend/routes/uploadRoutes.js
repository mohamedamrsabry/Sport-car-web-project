const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { uploadImages } = require('../controllers/uploadController');

router.post('/upload-images', upload.array('images', 4), uploadImages);

module.exports = router;