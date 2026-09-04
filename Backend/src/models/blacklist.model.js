const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is Required to be Added in Blacklist"]
    }
}, {
    timestamps: true
})

blacklistTokenSchema.index({
    createdAt: 1
}, {
    expireAfterSeconds: 60 * 60 * 24 // 1 day
})

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema);

module.exports = tokenBlacklistModel