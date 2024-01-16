const express = require('express');
const Router = express.Router();
const NewJoiningApply = require("../../DB/models/NewJoiningApply");

// new empployee joining form
Router.get('/new_employees_joining_form', async (req, res) => {
    res.render('form/new_Employees_joining');
});

Router.post('/new_employees_joining_form', async (req, res) => {
    try {
        const { full_name, gender, email, phone_number, address, apply_position, experience, description, per_day_salary } = req.body;
        const workerDetails = new NewJoiningApply({
            full_name, gender, email, phone_number, address, apply_position, experience, description, per_day_salary
        });
        await workerDetails.save();
        return res.status(200).send('<script>Swal.fire("Success", "Form submitted successfully", "success").then(() => { window.location.href = "/"; });</script>');
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
