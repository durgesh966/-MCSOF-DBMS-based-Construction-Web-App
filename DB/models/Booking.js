const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
    serviceId: {
        type: Number,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_number: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    type_of_work: {
        type: String,
        required: true
    },
    project_details: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    preferred_start_date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
