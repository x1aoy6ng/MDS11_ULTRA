const jwt = require("jsonwebtoken");

// jwt authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token){
        return res.status(401).json({error: 'Access token required'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error){
            if (error.name === 'TokenExpiredError'){
                return res.status(401).json({error: 'Token expired'});
            }
            return res.status(401).json({error: 'Invalid token'});
        }

        req.user = user;
        req.token = token;
        next();
    });
};

module.exports = {authenticateToken};