const express = require('express');
const Router = express.Router();
const upload = require('../../controller/multer');
const Service = require("../../DB/models/Service");

//routes Get method
// add service route 
Router.get('/add-services', (req, res) => {
    res.render('./Admin/service/addService');
});

// router POST method
Router.post('/add-services', upload.single('image'), async (req, res) => {
    try {
        const { titlename, description } = req.body;
        const image = req.file ? req.file.filename : null;
        console.log(titlename, description, image);
        await Service.create({
            titlename,
            description,
            image
        });
        return res.status(200).send('<script>Swal.fire("Success", "Service added successfully", "success").then(() => { window.location.href = "/add-services"; });</script>');
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