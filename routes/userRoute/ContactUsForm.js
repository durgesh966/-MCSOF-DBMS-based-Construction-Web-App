const express = require('express');
const Router = express.Router();

//require methods
const ContectUs = require("../../DB/models/ContectUs");

//routes Get method
// show contect page get routes
Router.get('/contactUs_form', async (req, res) => {
    res.render('form/contact_us');
});

// search contactus details in contacts
Router.post('/contactUs_form', async (req, res) => {
    try {
        const { full_name, phone_number, email, message } = req.body;
        await ContectUs.create({
            full_name,
            phone_number,
            email,
            message
        });
        return res.status(200).send('<script>Swal.fire("Success", "Message Sent Successfully", "success").then(() => { window.location.href = "/contactUs_form"; });</script>');
    } catch (error) {
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