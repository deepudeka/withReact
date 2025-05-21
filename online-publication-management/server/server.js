// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
//const db = require('../config/db');  // For serving static files if needed

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Serve static files from the 'uploads' directory (for profile pics, papers)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test DB connection (optional, db.js already does a basic check)
const db = require('./config/db');
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ message: 'DB connection successful', solution: rows[0].solution });
    } catch (error) {
        console.error('DB test error:', error);
        res.status(500).json({ message: 'DB connection failed', error: error.message });
    }
});

// Import routes (we'll create these next)
const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
const paperRoutes = require('./routes/paperRoutes');

app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/papers', paperRoutes);


// Simple welcome route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the Online Publication Management API!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});