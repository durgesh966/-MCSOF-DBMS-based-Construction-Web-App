const express = require('express');
const Router = express.Router();
const Service = require("../../DB/models/Service");
const Booking = require("../../DB/models/Booking");

//routes Get method
// Shhow all services
Router.get('/services', async (req, res) => {
    try {
        const Show_Service = await Service.find().lean();
        res.render('all_service', { Show_Service });
    } catch (err) {
        res.status(404).send(err);
    }
});

Router.get('/services:id', async (req, res) => {
    try {
        const Show_Service_info = await Service.findById(req.params.id).lean();
        res.render('services/service_full_info', { Show_Service_info });
    } catch (err) {
        res.status(404).send(err);
    }
});

Router.get('/booking_service', (req, res) => {
    res.render('services/book_services');
});

// book Service
Router.post('/booking_service', async (req, res) => {
    try {
        const { full_name, email, phone_number, location, address, type_of_work, projec_details, budget, preferred_start_date } = req.body;
        await Booking.create({
            full_name,
            email,
            phone_number,
            location,
            address,
            type_of_work,
            projec_details,
            budget,
            preferred_start_date
        });
        return res.status(200).send('<script>Swal.fire("Success", "Booking Submitted Successfully", "success").then(() => { window.location.href = "/"; });</script>');
    } catch (error) {
        // console.error(error);
        let errorMessage = 'Internal Server Error. Please fill input fields';
        if (error.name === 'ValidationError') {
            errorMessage = 'Validation Error. Please check your input data.';
        } else if (error.code === 11000) {
            errorMessage = 'Duplicate entry. The provided email or phone number is already registered.';
        }
        return res.status(500).send(`<script>Swal.fire("Error", "${errorMessage}", "error");</script>`);
    }
});

module.exports = Router;