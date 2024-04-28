const WorkDetails = require("../../../DB/models/WorkDetails");
const Service = require("../../../DB/models/Service");
const Booking = require("../../../DB/models/Booking");
const Worker = require("../../../DB/models/Worker");
const NewJoiningApply = require("../../../DB/models/NewJoiningApply");
const ContectUs = require("../../../DB/models/ContectUs");

const handleDatabaseError = (res, error) => {
    let errorMessage = 'Internal Server Error. Please fill input fields';
    if (error.name === 'ValidationError') {
        errorMessage = 'Validation Error. Please check your input data.';
    } else if (error.code === 11000) {
        errorMessage = 'Duplicate entry. The provided email or phone number is already registered.';
    }
    return res.status(500).send(`<script>Swal.fire("Error", "${errorMessage}", "error");</script>`);
};

const homePage = async (req, res) => {
    try {
        const show_Work_details = await WorkDetails.find().lean();
        res.render('index', { show_Work_details });
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

const about_us = (req, res) => {
    res.render('about_us');
};

// ---------------- for service and booking services -------------------
const service = async (req, res) => {
    try {
        const Show_Service = await Service.find().lean();
        res.render('all_service', { Show_Service });
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

const full_service_details = async (req, res) => {
    try {
        const Show_Service_info = await Service.findById(req.params.id).lean();
        res.render('services/service_full_info', { Show_Service_info });
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

const book_service = (req, res) => {
    res.render('services/book_services');
};

const service_booking = async (req, res) => {
    try {
        const { full_name, email, phone_number, location, address, type_of_work, projec_details, budget, preferred_start_date } = req.body;
        await Booking.create({
            full_name,
            email,
            phone_number,
            location,
            address,
            type_of_work,
            projec_details,
            budget,
            preferred_start_date
        });
        return res.status(200).send('<script>Swal.fire("Success", "Booking Submitted Successfully", "success").then(() => { window.location.href = "/"; });</script>');
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

// ----------------------- for worker only -------------------------------

const worker_details = async (req, res) => {
    try {
        const worker_details = await Worker.find().lean();
        res.render('worker/all_worker', { worker_details });
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

const show_worker_details = async (req, res) => {
    try {
        const worker_profile = await Worker.findById(req.params.id).lean();
        res.render('worker/worker_full_profile', { worker_profile });
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

// ----------------- employee Joining form -------------------

const new_employees_form = (req, res) => {
    res.render('form/new_Employees_joining');
};

const new_employees_joining_form = async (req, res) => {
    try {
        const { full_name, gender, email, phone_number, address, apply_position, experience, description, per_day_salary } = req.body;
        const workerDetails = new NewJoiningApply({
            full_name, gender, email, phone_number, address, apply_position, experience, description, per_day_salary
        });
        await workerDetails.save();
        return res.status(200).send('<script>Swal.fire("Success", "Form submitted successfully", "success").then(() => { window.location.href = "/"; });</script>');
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

// ----------------- contact_us pages -------------------

const contact = (req, res) => {
    res.render('form/contact_us');
};

const contact_form_subbmit = async (req, res) => {
    try {
        const { full_name, phone_number, email, message } = req.body;
        await ContectUs.create({
            full_name,
            phone_number,
            email,
            message
        });
        return res.status(200).send('<script>Swal.fire("Success", "Message Sent Successfully", "success").then(() => { window.location.href = "/contactUs_form"; });</script>');
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

module.exports = { homePage, about_us, service, full_service_details, book_service, service_booking, worker_details, show_worker_details, new_employees_form, new_employees_joining_form, contact, contact_form_subbmit };
