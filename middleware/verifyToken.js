const jwt = require('jsonwebtoken');

// Middleware to verify the user has an access token
const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }
    
    // Verify the token using your JWT secret
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token.' });
        }
        
        // Appends the user to the req object for use in routes if needed
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;