const multer = require('multer');
const path = require('path');
const fs = require('fs');

const productsDir = path.join(__dirname, '..', '..', 'public', 'partials', 'img', 'products');
if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const make = req.body.make;
        const model = req.body.model;
        const folderName = `${make} ${model}`;
        const folderPath = path.join(productsDir, folderName);
        
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const make = req.body.make;
        const model = req.body.model;
        const folderName = `${make} ${model}`;
        
        const folderPath = path.join(productsDir, folderName);
        const files = fs.readdirSync(folderPath).filter(f => f.match(/\.(jpg|jpeg|png|gif)$/i));
        
        let filename;
        if (files.length === 0) {
            filename = `${folderName}${path.extname(file.originalname)}`;
        } else {
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

module.exports = { upload, productsDir };