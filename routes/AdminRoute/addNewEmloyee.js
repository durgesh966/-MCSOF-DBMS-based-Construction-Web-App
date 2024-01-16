const express = require('express');
const Router = express.Router();
const Worker = require("../../DB/models/Worker");
const upload = require('../../controller/multer');


// Route to render the form
Router.get('/registration_worker', (req, res) => {
    res.render('./Admin/addEmployee/registration_worker');
});

// Route to handle form submission
Router.post('/registration_worker', upload.single('image'), async (req, res) => {
    try {
        const { first_name, last_name, gender, email, phone_number, country, state, city, post_code, service, description, charge, task_completed } = req.body;
        const image = req.file ? req.file.filename : null;
        await Worker.create({
            image,
            first_name,
            last_name,
            gender,
            email,
            phone_number,
            country,
            state,
            city,
            post_code,
            service,
            description,
            charge,
            task_completed
        });
        return res.status(200).send('<script>Swal.fire("Success", "Employee added successfully", "success").then(() => { window.location.href = "/registration_worker"; });</script>');
    } catch (error) {
        let errorMessage = 'Internal Server Error. Please fill in all input fields.';
        if (error.name === 'ValidationError') {
            errorMessage = 'Validation Error. Please check your input data.';
        } else if (error.code === 11000) {
            errorMessage = 'Duplicate entry. The provided email or phone number is already registered.';
        }
        return res.status(500).send(`<script>Swal.fire("Error", "${errorMessage}", "error");</script>`);
    }
});

module.exports = Router;
