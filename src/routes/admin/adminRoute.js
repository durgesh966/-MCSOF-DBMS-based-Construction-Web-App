const flash = require('connect-flash');
const bcrypt = require('bcrypt');

const upload = require('../../controllers/multer');

const Admin = require("../../../DB/models/Admin");
const Booking = require("../../../DB/models/Booking");
const ContectUs = require("../../../DB/models/ContectUs");
const NewJoiningApply = require("../../../DB/models/NewJoiningApply");
const Service = require("../../../DB/models/Service");
const WorkDetails = require("../../../DB/models/WorkDetails");
const Worker = require("../../../DB/models/Worker");

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
        console.error('Error fetching admin data:', err);
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
        console.error('Error during admin signup:', error);
        req.flash('error', 'Error occurred during signup');
        res.redirect("/signup");
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(password);
        const user = await Admin.findOne({ email });
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect("/adSignup");
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.flash('success', 'Login successful');
            const success = req.flash("success")[0];
            return res.redirect("/adDashboard", 302, { success });
        } else {
            req.flash('error', 'Incorrect password');
            return res.redirect("/", 302);
        }
    } catch (error) {
        console.error('Error during admin login:', error);
        req.flash('error', 'Error occurred during login');
        return res.redirect("/", 302);
    }
};

// Booking data routes

const bookWorkData = async (req, res) => {
    try {
        const booking = await Booking.find().lean();
        req.flash('success', 'Successfully fetched booking data.');
        res.render('./Admin/Booking/showBooking', { booking, successMessage: req.flash('success')[0] });
    } catch (error) {
        console.error('Error fetching booking data:', error);
        req.flash('error', 'Failed to fetch booking data.');
        res.status(404).send(error);
    }
};

const bookedWorkFullData = async (req, res) => {
    try {
        const userid = req.params.id;
        const booking_full_data = await Booking.findById(userid).lean();
        req.flash('success', 'Successfully fetched full booking data.');
        res.render('./Admin/Booking/full_booking_details', { booking_full_data, successMessage: req.flash('success')[0] });
    } catch (error) {
        console.error('Error fetching booked work full data:', error);
        req.flash('error', 'Failed to fetch full booking data.');
        res.status(404).send(error);
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
        console.error('Error deleting booking data:', error);
        req.flash('error', 'Error occurred while deleting booking data.');
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Contacts routes

const showAllContacts = async (req, res) => {
    try {
        const all_contacts = await ContectUs.find().lean();
        req.flash('success', 'Successfully fetched all contacts.');
        res.render('./Admin/contact/showContact', { all_contacts, successMessage: req.flash('success')[0] });
    } catch (error) {
        console.error('Error fetching all contacts:', error);
        req.flash('error', 'Failed to fetch all contacts.');
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
        req.flash('success', 'Successfully searched contacts.');
        res.render('./Admin/contact/searchResult', { contacts, query, successMessage: req.flash('success')[0] });
    } catch (error) {
        console.error('Error searching contacts:', error);
        req.flash('error', 'Failed to search contacts.');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteContacts = async (req, res) => {
    try {
        await ContectUs.findByIdAndDelete(req.params.id);
        req.flash('success', 'Contact deleted successfully.');
        res.redirect('/show_all_contacts');
    } catch (error) {
        console.error('Error deleting contacts:', error);
        req.flash('error', 'Error occurred while deleting contacts.');
        res.status(500).json({ error: error.message });
    }
};

// New employee apply details routes

const newEmployeeApplyData = async (req, res) => {
    try {
        const new_employee_data = await NewJoiningApply.find().lean();
        req.flash('success', 'Successfully fetched new employee application data.');
        res.render('./Admin/newEmployeeApplication/newEmployee', { new_employee_data, successMessage: req.flash('success')[0] });
    } catch (error) {
        console.error('Error fetching new employee application data:', error);
        req.flash('error', 'Failed to fetch new employee application data.');
        res.status(500).json({ error });
    }
};

const newEmployeeApplyFullData = async (req, res) => {
    try {
        const new_employee_full_data = await NewJoiningApply.findById(req.params.id).lean();
        req.flash('success', 'Successfully fetched full new employee data.');
        const viewRelativePath = 'Admin/newEmployeeApplication/newEmployee_full_Profile';
        res.render(viewRelativePath, { new_employee_full_data, successMessage: req.flash('success')[0] });
    } catch (error) {
        console.error('Error fetching new employee full data:', error);
        req.flash('error', 'Failed to fetch full new employee data.');
        res.status(500).json({ error });
    }
};

const deleteEmployeeApplyData = async (req, res) => {
    try {
        await NewJoiningApply.findByIdAndDelete(req.params.id);
        req.flash('success', 'New employee application data deleted successfully.');
        res.redirect('/new_employee_details');
    } catch (error) {
        console.error('Error deleting new employee application data:', error);
        req.flash('error', 'Error occurred while deleting new employee application data.');
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
                req.flash('error', 'Multer Error.');
                return res.redirect('/add-services');
            } else if (err) {
                console.error('Unknown Error:', err);
                req.flash('error', 'Unknown Error.');
                return res.redirect('/add-services');
            }
            const { titlename, description } = req.body;
            const image = req.file ? req.file.filename : null;
            console.log(titlename, description, image);
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

const addAndUpdateWork = async (req, res) => {
    try {
        const show_work_details = await WorkDetails.find().lean();
        req.flash('success', 'Successfully fetched work details.');
        res.render('./Admin/service/add_Work_Details', { show_work_details, successMessage: req.flash('success')[0] });
    } catch (error) {
        console.error('Error fetching work details:', error);
        req.flash('error', 'Failed to fetch work details.');
        res.status(500).json({ error });
    }
};

const addAndUpdateWorkData = async (req, res) => {
    try {
        const { docID, update_new_task, update_task_completed, update_team_members, update_customers } = req.body;
        if (docID) {
            if (!docID || !update_new_task || !update_task_completed || !update_team_members || !update_customers) {
                req.flash('error', 'Update Data not found.');
                return res.redirect('/add_working_details');
            };
            const updateData = {
                new_task: update_new_task,
                task_completed: update_task_completed,
                team_members: update_team_members,
                customers: update_customers
            };
            const updatedWorkDetails = await WorkDetails.findByIdAndUpdate(docID, updateData, { new: true });
            if (!updatedWorkDetails) {
                req.flash('error', 'Work Data not found.');
                return res.redirect('/add_working_details');
            }
            req.flash('success', 'Work Data updated successfully.');
            return res.redirect('/add_working_details');
        } else {
            const { new_task, task_completed, team_members, customers } = req.body;
            if (!new_task || !task_completed || !team_members || !customers) {
                req.flash('error', 'Data not found.');
                return res.redirect('/add_working_details');
            };
            await WorkDetails.create({
                new_task,
                task_completed,
                team_members,
                customers
            });
            req.flash('success', 'Work Data added successfully.');
            return res.redirect('/add_working_details');
        }
    } catch (error) {
        let errorMessage = 'Internal Server Error. Please fill in all input fields.';

        if (error.name === 'ValidationError') {
            errorMessage = 'Validation Error. Please check your input data.';
        } else if (error.code === 11000) {
            errorMessage = 'Duplicate entry. The provided email or phone number is already registered.';
        }
        req.flash('error', errorMessage);
        return res.redirect('/add_working_details');
    }
};

// Add employee routes

const registerWorker = (req, res) => {
    res.render('./Admin/addEmployee/registration_worker');
};

const ragisterWorkerFormSubbmit = async (req, res) => {
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
        req.flash('success', 'Employee added successfully.');
        return res.redirect('/registration_worker');
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
    addAndUpdateWork,
    addAndUpdateWorkData,
    registerWorker,
    ragisterWorkerFormSubbmit
};
