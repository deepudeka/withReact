// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { FullName, Email, Password, Institution, Country, Bio, ResearchInterest, Role } = req.body;

    if (!FullName || !Email || !Password) {
        return res.status(400).json({ message: 'Please add all required fields (FullName, Email, Password)' });
    }

    try {
        // Check if user already exists
        const [existingUsers] = await db.query('SELECT Email FROM Users WHERE Email = ?', [Email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const PasswordHash = await bcrypt.hash(Password, salt);

        // Create user
        const sql = `INSERT INTO Users (FullName, Email, PasswordHash, Institution, Country, Bio, ResearchInterest, Role)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [
            FullName, Email, PasswordHash, Institution, Country, Bio, ResearchInterest, Role || 'Researcher'
        ]);

        if (result.insertId) {
            const token = generateToken(result.insertId);
            res.status(201).json({
                UserID: result.insertId,
                FullName,
                Email,
                Role: Role || 'Researcher',
                token,
                message: 'User registered successfully'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const [users] = await db.query('SELECT * FROM Users WHERE Email = ?', [Email]);

        if (users.length > 0) {
            const user = users[0];
            const isMatch = await bcrypt.compare(Password, user.PasswordHash);

            if (isMatch) {
                const token = generateToken(user.UserID);
                res.json({
                    UserID: user.UserID,
                    FullName: user.FullName,
                    Email: user.Email,
                    Role: user.Role,
                    ProfilePicture: user.ProfilePicture,
                    token,
                    message: 'Login successful'
                });
            } else {
                res.status(400).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    // req.user is set by the 'protect' middleware
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(404).json({ message: 'User not found or not authenticated' });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getMe
};