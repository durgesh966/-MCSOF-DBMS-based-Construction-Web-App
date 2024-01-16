const express = require('express');
const Router = express.Router();

//require methods
const ContectUs = require("../../DB/models/ContectUs");

//routes Get method
// show contect page get routes
Router.get('/show_all_contects', async (req, res) => {
    try {
        const all_contect = await ContectUs.find().lean();
        res.render('./Admin/contact/showContact', { all_contect });
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

// search contactus details in contacts
Router.get('/show_search_contact', async (req, res) => {
    try {
        const query = req.query.query || '';
        const contacts = await ContectUs.find({
            $or: [
                { full_name: { $regex: new RegExp(query, 'i') } },
                { email: { $regex: new RegExp(query, 'i') } },
            ],
        }).lean();
        res.render('./Admin/contact/searchResult', { contacts, query });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

// router POST method
// delete contact
Router.post('/delete/:id', async (req, res) => {
    try {
        await ContectUs.findByIdAndDelete(req.params.id);
        res.redirect('/show_all_contects');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = Router;