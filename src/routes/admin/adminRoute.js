const multer = require('multer');
const csrf = require('csurf');
const bcrypt = require('bcrypt');
const debug = require('debug')('app:admin');

const upload = require('../../controllers/multer');
const { handleError } = require('../../middleware/error');

const Admin = require('../../../DB/models/Admin');
const Booking = require('../../../DB/models/Booking');
const ContectUs = require('../../../DB/models/ContectUs');
const NewJoiningApply = require('../../../DB/models/NewJoiningApply');
const Service = require('../../../DB/models/Service');
const WorkDetails = require('../../../DB/models/WorkDetails');
const Worker = require('../../../DB/models/Worker');

// Login and logout routes

const loginPage = (req, res) => {
    res.render('./Admin/adLogin');
};

const signupPage = (req, res) => {
    res.render('./Admin/adSignup');
};

const adminDashboard = async (req, res) => {
    try {
        const admin_data = await Admin.find().lean();
        res.render('./Admin/adDashboard', { admin_data });
    } catch (err) {
        debug('Error fetching admin data:', err);
        req.flash('error', 'Failed to fetch admin data');
        res.redirect('/');
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
        res.redirect("/");
    } catch (error) {
        debug('Error during admin signup:', error);
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
            res.redirect("/adSignup");
            return;
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.redirect("/adDashboard?success=Login+successful");
        } else {
            req.flash('error', 'Incorrect password');
            res.redirect("/");
        }
    } catch (error) {
        console.error('Error during admin login:', error);
        req.flash('error', 'Error occurred during login');
        res.redirect("/", 500, { error: req.flash(error)[0] });
    }
};


// Booking data routes

const bookWorkData = async (req, res) => {
    try {
        const booking = await Booking.find().lean();
        req.flash('success', 'Successfully fetched booking data.');
        res.render('./Admin/Booking/showBooking', { booking, successMessage: req.flash('success')[0] });
    } catch (error) {
        handleError(error, req, res, 'Failed to fetch booking data');
    }
};

const bookedWorkFullData = async (req, res) => {
    try {
        const userid = req.params.id;
        const booking_full_data = await Booking.findById(userid).lean();
        req.flash('success', 'Successfully fetched full booking data.');
        res.render('./Admin/Booking/full_booking_details', { booking_full_data, successMessage: req.flash('success')[0] });
    } catch (error) {
        handleError(error, req, res, 'Failed to fetch full booking data');
    }
};

const deleteBookData = async (req, res) => {
    try {
        const delete_data = await Booking.findByIdAndDelete(req.params.id);
        if (delete_data) {
            req.flash('success', 'Booking deleted successfully.');
            res.status(200).json({ message: 'Booking deleted successfully' });
        } else {
            req.flash('error', 'Booking not found.');
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        handleError(error, req, res, 'Error occurred while deleting booking data');
    }
};

// Contacts routes

const showAllContacts = async (req, res) => {
    try {
        const all_contacts = await ContectUs.find().lean();
        res.render('./Admin/contact/showContact', { all_contacts });
    } catch (error) {
        handleError(error, req, res, 'Failed to fetch all contacts');
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
        req.flash('success', 'Successfully searched contacts.');
        res.render('./Admin/contact/searchResult', { contacts, query, successMessage: req.flash('success')[0] });
    } catch (error) {
        handleError(error, req, res, 'Failed to search contacts');
    }
};

const deleteContacts = async (req, res) => {
    try {
        await ContectUs.findByIdAndDelete(req.params.id);
        res.redirect('/show_all_contacts');
    } catch (error) {
        handleError(error, req, res, 'Error occurred while deleting contacts');
    }
};

// New employee apply details routes

const newEmployeeApplyData = async (req, res) => {
    try {
        const new_employee_data = await NewJoiningApply.find().lean();
        res.render('./Admin/newEmployeeApplication/newEmployee', { new_employee_data });
    } catch (error) {
        handleError(error, req, res, 'Failed to fetch new employee application data');
    }
};

const newEmployeeApplyFullData = async (req, res) => {
    try {
        const new_Employee_full_data = await NewJoiningApply.findById(req.params.id).lean();
        res.render('./Admin/newEmployeeApplication/newEmployee_full_Profile', { new_Employee_full_data });
    } catch (error) {
        handleError(error, req, res, 'Failed to fetch full new employee data');
    }
};

const deleteEmployeeApplyData = async (req, res) => {
    try {
        await NewJoiningApply.findByIdAndDelete(req.params.id);
        console.log(NewJoiningApply);
        res.redirect('/new_employee_details');
    } catch (error) {
        handleError(error, req, res, 'Error occurred while deleting new employee application data');
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
                debug('Multer Error:', err);
                req.flash('error', 'Multer Error.');
                return res.redirect('/add-services');
            } else if (err) {
                debug('Unknown Error:', err);
                req.flash('error', 'Unknown Error.');
                return res.redirect('/add-services');
            }
            const { titlename, description } = req.body;
            const image = req.file ? req.file.filename : null;
            console.log(image);
            debug(titlename, description, image);
            await Service.create({
                titlename,
                description,
                image
            });
            req.flash('success', 'Service added successfully.');
            return res.redirect('/add-services');
        });
    } catch (error) {
        let errorMessage = 'Internal Server Error. Please fill in all input fields.';
        if (error.name === 'ValidationError') {
            errorMessage = 'Validation Error. Please check your input data.';
        } else if (error.code === 11000) {
            errorMessage = 'Duplicate entry. The provided email or phone number is already registered.';
        }
        req.flash('error', errorMessage);
        return res.redirect('/add-services');
    }
};

// Add and update work details routes

const showWorkData = async (req, res) => {
    try {
        const show_Work_details = await WorkDetails.find().lean();
        res.render('./Admin/service/add_Work_Details', { show_Work_details });
    } catch (error) {
        handleError(error, req, res, 'Failed to fetch work details');
    }
};

const addWorkData = async (req, res) => {
    try {
        const { new_task, task_completed, team_members, customers } = req.body;
        await WorkDetails.create({
            new_task,
            task_completed,
            team_members,
            customers
        });
        res.redirect('/success');
    } catch (error) {
        console.error('Failed to add working details:', error);
        res.status(500).send('Failed to add working details');
    }
};


const updateWorkData = async (req, res) => {
    try {
        const { docID, update_new_task, update_task_completed, update_team_members, update_customers } = req.body;
            if (!update_new_task || !update_task_completed || !update_team_members || !update_customers) {
                return res.redirect('/add_working_details');
            }
            const updateData = {
                new_task: update_new_task,
                task_completed: update_task_completed,
                team_members: update_team_members,
                customers: update_customers
            };
            const updatedWorkDetails = await WorkDetails.findByIdAndUpdate(docID, updateData, { new: true });
            if (!updatedWorkDetails) {
                return res.redirect('/add_working_details');
            }
            return res.redirect('/add_working_details');
    } catch (error) {
        console.error('Error adding or updating work details:', error);
        return res.redirect('/adDashboard');
    }
};


// Add employee routes

const registerWorker = (req, res) => {
    res.render('./Admin/addEmployee/registration_worker');
};

const registerWorkerFormSubmit = async (req, res) => {
    try {
        upload.single('image')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                throw new Error('File upload error: ' + err.message);
            } else if (err) {
                throw err;
            }

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
            req.flash('success', 'Employee added successfully.');
            return res.redirect('/registration_worker');
        });
    } catch (error) {
        let errorMessage = 'Internal Server Error. Please fill in all input fields.';
        if (error.name === 'ValidationError') {
            errorMessage = 'Validation Error. Please check your input data.';
        } else if (error.code === 11000) {
            errorMessage = 'Duplicate entry. The provided email or phone number is already registered.';
        }
        req.flash('error', errorMessage);
        return res.redirect('/registration_worker');
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
    showWorkData,
    addWorkData,
    updateWorkData,
    registerWorker,
    registerWorkerFormSubmit
};
