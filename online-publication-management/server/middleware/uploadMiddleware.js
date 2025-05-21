// server/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const paperUploadDir = path.join(__dirname, '..', 'uploads', 'papers');
const profilePicUploadDir = path.join(__dirname, '..', 'uploads', 'profile_pictures');

if (!fs.existsSync(paperUploadDir)) {
    fs.mkdirSync(paperUploadDir, { recursive: true });
}
if (!fs.existsSync(profilePicUploadDir)) {
    fs.mkdirSync(profilePicUploadDir, { recursive: true });
}

// Paper upload storage configuration
const paperStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, paperUploadDir);
    },
    filename: function (req, file, cb) {
        // UserID-PaperTitle-Timestamp.extension (sanitize title)
        const sanitizedTitle = req.body.PaperTitle ? req.body.PaperTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50) : 'paper';
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${req.user.UserID}-${sanitizedTitle}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Profile picture upload storage configuration
const profilePicStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, profilePicUploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${req.user.UserID}-profile-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File filter (example: allow only PDFs for papers, images for profile pics)
const paperFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed for papers!'), false);
    }
};

const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const uploadPaper = multer({
    storage: paperStorage,
    fileFilter: paperFileFilter,
    limits: { fileSize: 1024 * 1024 * 20 } // 20MB limit
});

const uploadProfilePic = multer({
    storage: profilePicStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

module.exports = { uploadPaper, uploadProfilePic };