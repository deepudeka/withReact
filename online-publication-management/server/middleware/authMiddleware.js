// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token (select without password)
            const [users] = await db.query('SELECT UserID, FullName, Email, Role FROM Users WHERE UserID = ?', [decoded.id]);
            if (users.length === 0) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            req.user = users[0];
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const isAdmin = (req, res, next) => { // Example, if you add an Admin role
    if (req.user && req.user.Role === 'Admin') { // Or specific admin user logic
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, isAdmin };