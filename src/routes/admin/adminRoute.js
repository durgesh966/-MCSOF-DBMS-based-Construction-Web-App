const flash = require('connect-flash');
const bcrypt = require('bcrypt');

const upload = require('../../../controller/multer');

const Admin = require("../../../DB/models/Admin");
const Booking = require("../../../DB/models/Booking");
const ContectUs = require("../../../DB/models/ContectUs");
const NewJoiningApply = require("../../../DB/models/NewJoiningApply");
const Service = require("../../../DB/models/Service");
const WorkDetails = require("../../../DB/models/WorkDetails");
const Worker = require("../../../DB/models/Worker");

// Login and logout routes

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

// Booking data routes

const bookWorkData = async(req, res) => {
    try {
        const booking = await Booking.find().lean();
        res.render('./Admin/Booking/showBooking',{booking});
    } catch (error) {
        console.error('Error fetching booking data:', error);
        res.status(404).send(error);
    }
};

const bookedWorkFullData = async (req, res) => {
    try {
        const userid = req.params.id;
        const booking_full_data = await Booking.findById(userid).lean();
        res.render('./Admin/Booking/full_booking_details', {booking_full_data});
    } catch (error) {
        console.error('Error fetching booked work full data:', error);
        res.status(404).send(error);
    }
};

const deleteBookData = async (req, res) => {
    try {
        const delete_data = await Booking.findByIdAndDelete(req.params.id);
        if (delete_data) {
            res.status(200).json({ message: 'Booking deleted successfully' });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error('Error deleting booking data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Contacts routes

const showAllContacts = async (req, res) => {
    try {
        const all_contacts = await ContectUs.find().lean();
        res.render('./Admin/contact/showContact', { all_contacts });
    } catch (error) {
        console.error('Error fetching all contacts:', error);
        res.status(404).json({ error });
    }
};

const searchContact = async (req, res) => {
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
        console.error('Error searching contacts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteContacts = async (req, res) => {
    try {
        await ContectUs.findByIdAndDelete(req.params.id);
        res.redirect('/show_all_contacts');
    } catch (error) {
        console.error('Error deleting contacts:', error);
        res.status(500).json({ error: error.message });
    }
};

// New employee apply details routes

const newEmployeeApplyData = async (req, res) => {
    try {
        const new_employee_data = await NewJoiningApply.find().lean();
        res.render('./Admin/newEmployeeApplication/newEmployee', { new_employee_data });
    } catch (error) {
        console.error('Error fetching new employee application data:', error);
        res.status(500).json({ error });
    }
};

const newEmployeeApplyFullData = async (req, res) => {
    try {
        const new_employee_full_data = await NewJoiningApply.findById(req.params.id).lean();
        const viewRelativePath = 'Admin/newEmployeeApplication/newEmployee_full_Profile';
        res.render(viewRelativePath, { new_employee_full_data });
    } catch (error) {
        console.error('Error fetching new employee full data:', error);
        res.status(500).json({ error });
    }
};

const deleteEmployeeApplyData = async (req, res) => {
    try {
        await NewJoiningApply.findByIdAndDelete(req.params.id);
        res.redirect('/new_employee_details');
    } catch (error) {
        console.error('Error deleting new employee application data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Add services routes

const addServices = (req, res) => {
    res.render('./Admin/service/addService');
};

const uploadNewServices = async (req, res) => {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                console.error('Multer Error:', err);
                return res.status(500).send(`<script>Swal.fire("Error", "Multer Error", "error");</script>`);
            } else if (err) {
                console.error('Unknown Error:', err);
                return res.status(500).send(`<script>Swal.fire("Error", "Unknown Error", "error");</script>`);
            }
            const { titlename, description } = req.body;
            const image = req.file ? req.file.filename : null;
            console.log(titlename, description, image);
            await Service.create({
                titlename,
                description,
                image
            });
            return res.status(200).send('<script>Swal.fire("Success", "Service added successfully", "success").then(() => { window.location.href = "/add-services"; });</script>');
        });
    } catch (error) {
        let errorMessage = 'Internal Server Error. Please fill in all input fields.';

        if (error.name === 'ValidationError') {
            errorMessage = 'Validation Error. Please check your input data.';
        } else if (error.code === 11000) {
            errorMessage = 'Duplicate entry. The provided email or phone number is already registered.';
        }
        return res.status(500).send(`<script>Swal.fire("Error", "${errorMessage}", "error");</script>`);
    }
};

// Add and update work details routes

const addAndUpdateWork = async (req, res) => {
    try {
        const show_work_details = await WorkDetails.find().lean();
        res.render('./Admin/service/add_Work_Details', { show_work_details });
    } catch (error) {
        console.error('Error fetching work details:', error);
        res.status(500).json({ error });
    }
};

const addAndUpdateWorkData = async (req, res) => {
    try {
        const { docID, update_new_task, update_task_completed, update_team_members, update_customers } = req.body;
        if (docID) {
            if (!docID || !update_new_task || !update_task_completed || !update_team_members || !update_customers) {
                return res.status(404).send('<script>Swal.fire("Error", "Update Data not found", "error");</script>');
            };
            const updateData = {
                new_task: update_new_task,
                task_completed: update_task_completed,
                team_members: update_team_members,
                customers: update_customers
            };
            const updatedWorkDetails = await WorkDetails.findByIdAndUpdate(docID, updateData, { new: true });
            if (!updatedWorkDetails) {
                return res.status(404).send('<script>Swal.fire("Error", "Work Data not found", "error");</script>');
            }
            return res.status(200).send('<script>Swal.fire("Success", "Work Data updated successfully", "success").then(() => { window.location.href = "/add_working_details"; });</script>');
        } else {
            const { new_task, task_completed, team_members, customers } = req.body;
            if (!new_task || !task_completed || !team_members || !customers) {
                return res.status(404).send('<script>Swal.fire("Error", "Data not found", "error");</script>');
            };
            await WorkDetails.create({
                new_task,
                task_completed,
                team_members,
                customers
            });
            return res.status(200).send('<script>Swal.fire("Success", "Work Data added successfully", "success").then(() => { window.location.href = "/add_working_details"; });</script>');
        }
    } catch (error) {
        let errorMessage = 'Internal Server Error. Please fill in all input fields.';

        if (error.name === 'ValidationError') {
            errorMessage = 'Validation Error. Please check your input data.';
        } else if (error.code === 11000) {
            errorMessage = 'Duplicate entry. The provided email or phone number is already registered.';
        }
        return res.status(500).send(`<script>Swal.fire("Error", "${errorMessage}", "error");</script>`);
    }
};

// Add employee routes

const registerWorkerGet = (req, res) => {
    res.render('./Admin/addEmployee/registration_worker');
};

const registerWorkerPost = async (req, res) => {
    try {
        const { first_name, last_name, gender, email, phone_number, country, state, city, post_code, service, description, charge, task_completed } = req.body;
        const image = req.file ? req.file.filename : null;
        await Worker.create({
            image,
            first_name,
            last_name,
            gender,
            email,
            phone_number,
            country,
            state,
            city,
            post_code,
            service,
            description,
            charge,
            task_completed
        });
        return res.status(200).send('<script>Swal.fire("Success", "Employee added successfully", "success").then(() => { window.location.href = "/registration_worker"; });</script>');
    } catch (error) {
        let errorMessage = 'Internal Server Error. Please fill in all input fields.';
        if (error.name === 'ValidationError') {
            errorMessage = 'Validation Error. Please check your input data.';
        } else if (error.code === 11000) {
            errorMessage = 'Duplicate entry. The provided email or phone number is already registered.';
        }
        return res.status(500).send(`<script>Swal.fire("Error", "${errorMessage}", "error");</script>`);
    }
};

module.exports = { 
    loginPage, 
    signupPage, 
    adminDashboard, 
    adminSignup, 
    adminLogin, 
    bookWorkData, 
    bookedWorkFullData, 
    deleteBookData, 
    showAllContacts,
    searchContact,
    deleteContacts,
    newEmployeeApplyData,
    newEmployeeApplyFullData,
    deleteEmployeeApplyData,
    addServices,
    uploadNewServices,
    addAndUpdateWork,
    addAndUpdateWorkData,
    registerWorkerGet,
    registerWorkerPost
};
