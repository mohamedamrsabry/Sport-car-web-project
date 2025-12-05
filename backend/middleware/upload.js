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
        // Track the index of the file in the current upload
        if (typeof req.fileIndex !== 'number') req.fileIndex = 0;
        const make = req.body.make;
        const model = req.body.model;
        const folderName = `${make} ${model}`;
        const ext = path.extname(file.originalname);
        
        let filename;
        if (req.fileIndex === 0) {
            filename = `${folderName}${ext}`;
        } else if (req.fileIndex === 1) {
            filename = `A${ext}`;
        } else if (req.fileIndex === 2) {
            filename = `B${ext}`;
        } else if (req.fileIndex === 3) {
            filename = `C${ext}`;
        } else {
            filename = `extra_${req.fileIndex}${ext}`;
        }
        req.fileIndex++;
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