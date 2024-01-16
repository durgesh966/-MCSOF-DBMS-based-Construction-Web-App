const express = require('express');
const bcrypt = require('bcrypt');
const routes = express.Router();

//require methods
const User = require("../DB/models/user");
const registerDetails = require("../DB/models/registration");
const Detail = require("../DB/models/Detail");


//routes Get method
routes.get('/', (req, res) => {
    res.render('index');
});

routes.get('/login', (req, res) => {
    res.render('form/login');
});

routes.get('/service', (req, res) => {
    res.render('service');
});

routes.get('/service_details/air-conditioner', (req, res) => {
    res.render('service_details');
})

routes.get('/contact_us', (req, res) => {
    res.render('form/contact_us');
});

routes.get('/about_us', (req, res) => {
    res.render('about_us');
});

routes.get('/registration', (req, res) => {
    res.render('form/registration');
});

routes.get('/registration_worker', (req, res) => {
    res.render('form/registration_worker');
});

routes.get('/user_page', (req, res) => {
    res.render('user_page');
})
routes.get('/user_page_service', (req, res) => {
    res.render('user_page_service');
})



//Post method / storing data for new user

routes.post('/registration', async (req, res) => {
    try {
        const register = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            gender: req.body.gender,
            email: req.body.email,
            password: req.body.password,
            phone_number: req.body.phone_number,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            post_code: req.body.post_code
        })

        const registered = await register.save();

        res.status(201).send("your data is successfully registered! We will shortly contact you");
    }
    catch (error) {
        res.status(400).send("error occur" + "  " + error);
    }
})
//Post method / storing data for registeration of worker

routes.post('/registration_worker', async (req, res) => {

    try {

        const register_worker = new registerDetails({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            gender: req.body.gender,
            email: req.body.email,
            phone_number: req.body.phone_number,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            post_code: req.body.post_code,
            service: req.body.service,
            description: req.body.description,
            charge: req.body.charge
        })

        const registered_worker = await register_worker.save();

        res.status(201).send("your data is successfully registered! We will shortly contact you");
    }
    catch (error) {
        res.status(400).send("error occur" + "  " + error);
    }
})

//login post method
routes.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const information = await User.findOne({ email: email });

        if (information.password == password) {
            res.status(201).redirect("user_page");

        }
        else {
            res.send("invalid Username / Password details");
        }
    }
    catch (error) {
        res.status(400).send("invalid details   " + error)

    }
})

module.exports = routes;