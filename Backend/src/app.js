const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "Endpoint not found"
    });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            message: err.message
        });
    }

    if (err.message === "Only PDF files are allowed") {
        return res.status(400).json({
            message: err.message
        });
    }

    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;