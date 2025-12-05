const path = require('path');
const fs = require('fs');

const uploadImages = (req, res) => {
    try {
        if (!req.files || req.files.length !== 4) {
            return res.status(400).json({ message: 'Please upload exactly 4 images' });
        }

        const make = req.body.make;
        const model = req.body.model;
        const folderName = `${make} ${model}`;
        const productsDir = path.join(__dirname, '..', '..', 'public', 'partials', 'img', 'products');
        const folderPath = path.join(productsDir, folderName);
        
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
};

module.exports = {
    uploadImages
};