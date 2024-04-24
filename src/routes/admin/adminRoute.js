const bcrypt = require('bcrypt');
const Admin = require("../../../DB/models/Admin");


const loginPage = (req, res) => {
    res.render('./Admin/adLogin', { message: req.flash('error') });
};

const signupPage = (req, res) => {
    res.render('./Admin/adSignup', { message: req.flash('error') });
};

const adminDashboard = async (req, res) => {
    try {
        const admin_data = await Admin.find().lean();
        res.render('./Admin/adDashboard', { admin_data, message: req.flash('success') });
    } catch (err) {
        console.error('Error fetching admin data:', err);
        res.status(500).send('Server error');
    }
};

const adminSignup = async (req, res) => {
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
        await newAdmin.save();
        req.flash('success', 'Signup successful. Please log in.');
        res.redirect("/login");
    } catch (error) {
        console.error('Error during admin signup:', error);
        req.flash('error', 'Error occurred during signup');
        res.redirect("/signup");
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Admin.findOne({ email });
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect("/login");
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.flash('success', 'Login successful');
            res.redirect("/adDashboard");
        } else {
            req.flash('error', 'Incorrect password');
            res.redirect("/login");
        }
    } catch (error) {
        console.error('Error during admin login:', error);
        req.flash('error', 'Error occurred during login');
        res.redirect("/login");
    }
};

module.exports = { loginPage, signupPage, adminDashboard, adminSignup, adminLogin };
