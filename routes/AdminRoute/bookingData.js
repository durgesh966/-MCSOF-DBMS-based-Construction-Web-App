const express = require('express');
const Router = express.Router();

//require methods
const Booking = require("../../DB/models/Booking");

//routes Get method
Router.get('/booking_work_data', async(req, res) => {
    try {
        const booking = await Booking.find().lean();
        res.render('./Admin/Booking/showBooking',{booking});
    } catch (error) {
        res.status(404).send(error);
    }
});
Router.get('/booking_work_full_data:id', async (req, res) => {
    try {
        const userid = req.params.id;
        const booking_full_data = await Booking.findById(userid).lean();
        res.render('./Admin/Booking/full_booking_details', {booking_full_data: booking_full_data});
    } catch (error) {
        res.status(404).send(error);
    }
});

Router.post('/delete_booked_data/:id', async (req, res) => {
    try {
        const delete_data = await Booking.findByIdAndDelete(req.params.id);
        if (delete_data) {
            res.status(200).json({ message: 'Booking deleted successfully' });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = Router;