const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Admin = require("../../DB/models/Admin");
const nodeMailer = require("../../controller/nodeMailer");
const router = express.Router();

// MongoDB for session storage
const mongoStoreOptions = {
    mongoUrl: process.env.MONGO_URL,
    collection: 'sessions',
};

const sessionMiddleware = session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create(mongoStoreOptions),
    cookie: { maxAge: 600000 },
});

// Set up session middleware
router.use(sessionMiddleware);
router.get('/node_email', nodeMailer);

// get routers 
router.get('/', (req, res) => {
    res.render('./Admin/adLogin');
});

router.get('/adSignup', (req, res) => {
    res.render('./Admin/adSignup');
});

router.get('/adDashboard', async (req, res) => {
    try {
        const admin_data = await Admin.find().lean();
        res.render('./Admin/adDashboard', { admin_data });
    } catch (err) {
        console.error('Error fetching admin data:', err);
        res.status(500).send('Server error');
    }
});

// post routers
router.post('/adSignup', async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone_number } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            first_name,
            last_name,
            email,
            phone_number,
            password: hashedPassword,
        });
        const admin_signup_success = await newAdmin.save();
        if (admin_signup_success) {
            return res.status(200).send('<script>Swal.fire("Success", "SignUp successful you can login now", "success").then(() => { window.location.href = "/"; });</script>');
        } else {
            return res.status(200).send('<script>Swal.fire("Error", "Invalid password plese enter valid password", "error").then(() => { window.location.href = "/adSignup"; });</script>');
        }
    } catch (error) {
        console.error('Error during admin signup:', error);
        return res.status(200).send('<script>Swal.fire("Error", "Error during admin signup", "error");</script>');
    }
});

// login route 
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const check_user = await Admin.findOne({ email });
        if (!check_user) return res.status(500).send(`<script>Swal.fire("Error", "Email not Match", "error");</script>`);
        const match = await bcrypt.compare(password, check_user.password);
        if (match) {
            return res.status(200).send('<script>Swal.fire("Success", "Login successful", "success").then(() => { window.location.href = "/adDashboard"; });</script>');
        } else {
            return res.status(500).send(`<script>Swal.fire("Error", "Password not Match", "error");</script>`);
        }
    } catch (error) {
        let errorMessage = 'Internal Server Error. Please fill input fields';
        if (error.name === 'ValidationError') errorMessage = 'Validation Error. Please check your input data.';
        return res.status(500).send(`<script>Swal.fire("Error", "${errorMessage}", "error");</script>`);
    }
});

module.exports = router;