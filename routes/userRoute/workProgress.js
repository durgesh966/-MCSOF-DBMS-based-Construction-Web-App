const express = require('express');
const Router = express.Router();
const WorkDetails = require("../../DB/models/WorkDetails");

// Route to render the form
Router.get('/', async (req, res) => {
    try {
        const show_Work_details = await WorkDetails.find().lean();
        res.render('index', { show_Work_details });
    } catch (err) {
        res.status(404).send(err);
    }
});

module.exports = Router;