const express = require('express');
const bcrypt = require('bcrypt');
const Router = express.Router();

//require methods
const User = require("../DB/models/user");
const registerDetails = require("../DB/models/registration");
const Detail = require("../DB/models/Detail");
const Admin = require("../DB/models/Admin");

//routes Get method

// for admin personal routes
Router.get('/Admin-Login', (req, res) => {
    res.render('./Admin/adLogin');
});
Router.get('/Admin-Signup', (req, res) => {
    res.render('./Admin/adSignup');
});
Router.get('/Admin-Dashboard', (req, res) => {
    res.render('./Admin/adDashboard');
});

// add service route 


// router POST method

// new admin signup
Router.post('/Admin-Signup', async (req, res) => {
    const { first_name, last_name, email, password, phone_number } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            first_name,
            last_name,
            email,
            phone_number,
            password: hashedPassword,
        });
        await newAdmin.save();
        res.redirect("/Admin-Dashboard");
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// admin login
Router.post('/Admin-Login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const check_admin = await Admin.findOne({ email });
        const password_matched = await bcrypt.compare(password, check_admin.password);
        if (password_matched) {
            res.redirect("/Admin-Dashboard");
        } else {
            res.redirect("/Admin-Signup");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});




module.exports = Router;