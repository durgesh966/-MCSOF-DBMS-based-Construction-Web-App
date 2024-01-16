const express = require('express');
const Router = express.Router();
const Worker = require("../../DB/models/Worker");

// show all worker details
Router.get('/worker_details', async (req, res) => {
    try {
        const worker_details = await Worker.find().lean();
        res.render('worker/all_worker', { worker_details });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error. Please try again' });
    }
});

// show full details of a single worker
Router.get('/worker_details:id', async (req, res) => {
    try {
        const worker_profile = await Worker.findById(req.params.id).lean();
        res.render('worker/worker_full_profile', { worker_profile });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error. Please try again' });
    }
});


module.exports = Router;
