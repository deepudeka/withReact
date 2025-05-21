// server/routes/paperRoutes.js
const express = require('express');
const router = express.Router();
const { uploadPaper, getPapers, getPaperById } = require('../controllers/paperController');
const { protect } = require('../middleware/authMiddleware');
const { uploadPaper: paperUploadMiddleware } = require('../middleware/uploadMiddleware'); // Renamed for clarity

// POST /api/papers - Upload a new paper (protected, requires file upload)
router.post('/', protect, paperUploadMiddleware.single('paperFile'), uploadPaper);

// GET /api/papers - Get all papers
router.get('/', getPapers);

// GET /api/papers/:id - Get a single paper by ID
router.get('/:id', getPaperById);

module.exports = router;