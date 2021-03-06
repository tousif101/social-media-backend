const mongoose = require("mongoose");
const uuid = require('uuid');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    uuid: {
        type: String,
        required: true
    },
    friends: [String]

});
module.exports = User = mongoose.model("users", UserSchema);