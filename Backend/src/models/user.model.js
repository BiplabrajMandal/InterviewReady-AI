const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Username is Required"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is Required"]
    },
    password: {
        type: String,
        required: [true, "Password is Required"]
    }
})

const userModel = mongoose.model("users", userSchema);

module.exports = userModel