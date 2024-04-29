const express = require("express");
const exphbs = require('express-handlebars');
const path = require('path');
const cors = require("cors");
require('colors');
require('dotenv').config({ path: "./config/.env" });
require('./DB/connection/connection');

// Destructuring
const { 
    homePage, 
    about_us, 
    service, 
    full_service_details, 
    book_service, 
    service_booking, 
    printPage,
    worker_details, 
    show_worker_details, 
    new_employees_form, 
    new_employees_joining_form, 
    contact, 
    contact_form_submit 
} = require("./src/routes/user/userRoute");

const app = express();
const port = process.env.PORT || 9000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Template engine
app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');
// Routes
app.get('/', homePage);
app.get('/about_us', about_us);
app.get('/services', service);
app.get('/services:id', full_service_details);
app.get('/booking_service:id', book_service);
app.get('/final_print', printPage);
app.get('/worker_details', worker_details);
app.get('/worker_details:id', show_worker_details);
app.get('/new_employees_joining_form', new_employees_form);
app.get('/contactUs_form', contact);

// Post routes
app.post('/booking_service', service_booking);
app.post('/new_employees_joining_form', new_employees_joining_form);
app.post('/contactUs_form', contact_form_submit);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went to wrong in give code!');
});

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`.bgGreen.black.bold);
});
