const express = require('express');
const Router = express.Router();
const WorkDetails = require("../../DB/models/WorkDetails");

//Router Get method
Router.get('/about_us', (req, res) => {
    res.render('about_us');
});

module.exports = Router;