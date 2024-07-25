const mongoose = require("mongoose");

const ContectUs = mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    },

    phone_number: {
        type: Number,
        required: true,
    }
});
module.exports = mongoose.model("ContectUs_Details", ContectUs);