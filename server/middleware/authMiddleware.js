const jwt = require('jsonwebtoken');
const User = require('../models/userdb');

require('dotenv').config();

async function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        req.userId = user._id;
        next();
    } catch (error) {
        console.log("Error in middleware", error);
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}

module.exports = authMiddleware;