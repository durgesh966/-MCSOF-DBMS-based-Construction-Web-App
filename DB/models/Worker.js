const mongoose = require("mongoose");

const Worker = mongoose.Schema({
    image: {
        type: String
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
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
        unique: true
    },
    phone_number: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type:
            String,
        required: true
    },
    post_code: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    charge: {
        type: Number,
        required: true
    },
    task_completed: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("New_worker_joining_form", Worker);