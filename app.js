const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const cors = require("cors");
const passport = require('passport');
const session = require('express-session');
require('dotenv').config({ path: "./config/.env" });
require('./DB/connection/connection');

// Importing routes
const { 
    homePage, 
    about_us, 
    service, 
    full_service_details, 
    book_service, 
    service_booking, 
    printPage,
    searchBookedService,
    worker_details, 
    show_worker_details, 
    new_employees_form, 
    new_employees_joining_form, 
    contact, 
    contact_form_submit, 
    searchedServices,
    user_login, 
    google_Auth_faliur_Success
} = require("./src/routes/user/userRoute");

const port = process.env.PORT || 9000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET 
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

const userController = require('./src/controllers/userController');

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
app.get('/services/:id', full_service_details);
app.get('/booking_service/:id', book_service);
app.get('/final_print', printPage);
app.get('/work_status', searchBookedService);
app.get('/worker_details', worker_details);
app.get('/worker_details/:id', show_worker_details);
app.get('/new_employees_joining_form', new_employees_form);
app.get('/contactUs_form', contact);
app.get('/show_search_service', searchedServices);
app.get('/auth', userController.loadAuth);
app.get('/auth/google', user_login);
app.get('/auth/google/callback', google_Auth_faliur_Success);
app.get('/success', userController.successGoogleLogin); 
app.get('/failure', userController.failureGoogleLogin);

// Post routes
app.post('/booking_service', service_booking);
app.post('/new_employees_joining_form', new_employees_joining_form);
app.post('/contactUs_form', contact_form_submit);
app.post('/show_search_service', searchedServices);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong in the code!');
});

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
