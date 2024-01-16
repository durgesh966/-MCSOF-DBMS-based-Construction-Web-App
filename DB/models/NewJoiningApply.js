const mongoose = require("mongoose");

const NewJoiningApply = mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    apply_position: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    per_day_salary: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model("New_worker_joining_Us_Apply_form", NewJoiningApply);