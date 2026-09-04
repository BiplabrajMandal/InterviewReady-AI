const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({
                message: "Token Not Provided"
            });
        }

        const isTokenBlacklisted = await tokenBlacklistModel.findOne({
            token
        });

        if (isTokenBlacklisted) {
            return res.status(401).json({
                message: "Token is Invalid"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Invalid or Expired Token"
            });
        }

        return res.status(500).json({
            message: "Authentication service error: " + error.message
        });
    }
}

module.exports = { authUser }