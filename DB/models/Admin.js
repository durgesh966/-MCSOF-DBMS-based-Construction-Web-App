const mongoose = require("mongoose");

const admin_login = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone_number: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

});
module.exports = mongoose.model("for_admin", admin_login);