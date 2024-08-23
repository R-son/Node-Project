const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (token == null) return res.sendStatus(401); // No token

    jwt.verify(token, process.env.API_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user;
        next();
    });
};

exports.authorizeRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role; // Assuming role is in the token payload
        if (roles.includes(userRole)) {
            next();
        } else {
            res.status(403).send('Forbidden: You do not have the required role');
        }
    };
};
