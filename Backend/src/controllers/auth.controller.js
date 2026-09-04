const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blacklist.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000 // 1 day
};

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            });
        }

        const isUserAlreadyExist = await userModel.findOne({
            $or: [{ username }, { email }]
        });
        if (isUserAlreadyExist) {
            return res.status(400).json({
                message: "Account already exists with this email address or username"
            });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username,
            email,
            password: hash
        });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.cookie("token", token, COOKIE_OPTIONS);

        res.status(201).json({
            message: "User Registered Successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Registration failed: " + error.message
        });
    }
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in request body
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, COOKIE_OPTIONS);
        res.status(200).json({
            message: "User Logged In Successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Login failed: " + error.message
        });
    }
}

/**
 * @name logoutUserController
 * @description Clear token from User Cookie and the token in blacklist
 * @access Public
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies?.token;
        if (token) {
            await tokenBlacklistModel.create({ token });
        }

        res.clearCookie("token", COOKIE_OPTIONS);
        res.status(200).json({
            message: "User Logged Out Successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Logout failed: " + error.message
        });
    }
}

/**
 * @name getMeController
 * @description Get the Current Logged In User Details
 * @access Private
 */
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        res.status(200).json({
            message: "User Details Fetched Successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user details: " + error.message
        });
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}