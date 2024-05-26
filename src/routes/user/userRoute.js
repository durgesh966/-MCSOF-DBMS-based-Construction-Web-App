const uniqueIdGenerator = require('../../middleware/uniqueId_genrator');

const WorkDetails = require("../../../DB/models/WorkDetails");
const Service = require("../../../DB/models/Service");
const Booking = require("../../../DB/models/Booking");
const Worker = require("../../../DB/models/Worker");
const NewJoiningApply = require("../../../DB/models/NewJoiningApply");
const ContectUs = require("../../../DB/models/ContectUs");
const passport = require('passport');

const handleDatabaseError = (res, error) => {
    let errorMessage = 'Internal Server Error. Please fill input fields';
    if (error.name === 'ValidationError') {
        errorMessage = 'Validation Error. Please check your input data.';
    } else if (error.code === 11000) {
        errorMessage = 'Duplicate entry. The provided email or phone number is already registered.';
    }
    res.status(500).redirect("/?error=Internal+server+error");
};

const homePage = async (req, res) => {
    try {
        const show_Work_details = await WorkDetails.find().lean();
        res.render('index', {
            show_Work_details,
            message: req.query.message,
            error: req.query.error,
            success: req.query.success
        });
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

const about_us = (req, res) => {
    res.render('about_us', {
        message: req.query.message,
        error: req.query.error,
        success: req.query.success
    });
};

// ---------------- for service and booking services -------------------
const service = async (req, res) => {
    try {
        const Show_Service = await Service.find().lean();
        res.render('all_service', {
            Show_Service,
            message: req.query.message,
            error: req.query.error,
            success: req.query.success
        });
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

const full_service_details = async (req, res) => {
    try {
        const Show_Service_info = await Service.findById(req.params.id).lean();
        if (!Show_Service_info) {
            return res.status(404).render('services/service_full_info', {
                error: 'Service not found.'
            });
        }

        res.render('services/service_full_info', {
            Show_Service_info,
            message: req.query.message,
            error: req.query.error,
            success: req.query.success
        });
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

const book_service = async (req, res) => {
    try {
        const book_service_info = await Service.findById(req.params.id).lean();
        if (!book_service_info) {
            return res.status(404).render('services/service_full_info', {
                error: 'Service not found.'
            });
        }
        res.render('services/book_services', {
            book_service_info,
            message: req.query.message,
            error: req.query.error,
            success: req.query.success
        });
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

const service_booking = async (req, res) => {
    try {
        const { full_name, email, phone_number, location, address, type_of_work, project_details, budget, preferred_start_date } = req.body;
        const serviceId = uniqueIdGenerator();
        if (!serviceId || !full_name || !email || !phone_number || !location || !address || !type_of_work || !project_details || !budget || !preferred_start_date) {
            return res.status(400).redirect("/booking_service:id?error=Missing+input+fields");
        }
        await Booking.create({
            serviceId,
            full_name,
            email,
            phone_number,
            location,
            address,
            type_of_work,
            project_details,
            budget,
            preferred_start_date
        });
        return res.status(200).redirect(`/final_print?success=Booking+Submitted+Successfully&serviceId=${serviceId}`);

    } catch (error) {
        console.error("Error during booking:", error);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
};

const printPage = async (req, res) => {
    try {
        const serviceId = req.query.serviceId;
        const show_final_print = await Booking.findOne({ serviceId }).lean();
        res.render('printPage/print.hbs', {
            show_final_print,
            message: req.query.message,
            error: req.query.error,
            success: req.query.success
        });
    } catch (error) {
        console.error("Error retrieving data:", error);
        handleDatabaseError(res, error);
    }
};

const searchBookedService = async (req, res) => {
    try {
        res.render('searchService/searchPage.hbs', {
            message: req.query.message,
            error: req.query.error,
            success: req.query.success
        });
    } catch (error) {
        console.error("Error rendering search page:", error);
        handleDatabaseError(res, error); // Assuming handleDatabaseError is defined elsewhere
    }
};

const searchedServices = async (req, res) => {
    try {
        let serviceId = req.body.serviceId; 
        if (!serviceId || isNaN(serviceId)) {
            return res.status(400).redirect("/work_status?error=Invalid+search+query");
        }
        const booking_data = await Booking.find({
            $or: [
                { serviceId: serviceId }
            ],
        }).lean();
        if (booking_data.length === 0) {
            return res.status(404).redirect("/work_status?error=Search+result+not+found");
        }
        res.render('searchService/searchResultPage.hbs', { booking_data, success: 'Successfully searched book data' });
    } catch (error) {
        console.error('Error searching contacts:', error);
        res.status(500).json({ error: 'Failed to search contacts' });
    }
};

// ----------------------- for worker only -------------------------------

const worker_details = async (req, res) => {
    try {
        const worker_details = await Worker.find().lean();
        res.render('worker/all_worker', {
            worker_details,
            message: req.query.message,
            error: req.query.error,
            success: req.query.success
        });
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

const show_worker_details = async (req, res) => {
    try {
        const worker_profile = await Worker.findById(req.query.id).lean();
        res.render('worker/worker_full_profile', {
            worker_profile,
            message: req.query.message,
            error: req.query.error,
            success: req.query.success
        });
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

// ----------------- employee Joining form -------------------

const new_employees_form = (req, res) => {
    res.render('form/new_Employees_joining', {
        message: req.query.message,
        error: req.query.error,
        success: req.query.success
    });
};

const new_employees_joining_form = async (req, res) => {
    try {
        const { full_name, gender, email, phone_number, address, apply_position, experience, description, per_day_salary } = req.body;
        const requiredFields = [full_name, gender, email, phone_number, address, apply_position, experience, description, per_day_salary];
        if (requiredFields.some(field => !field)) {
            return res.status(400).redirect("/new_employees_joining_form?error=Please+fill+all+required+fields");
        }
        if (!isValidEmail(email)) {
            return res.status(400).redirect("/new_employees_joining_form?error=Please+enter+a+valid+email+address");
        }
        if (!isValidPhoneNumber(phone_number)) {
            return res.status(400).redirect("/new_employees_joining_form?error=Please+enter+a+valid+phone+number");
        }
        const workerDetails = new NewJoiningApply({
            full_name, gender, email, phone_number, address, apply_position, experience, description, per_day_salary
        });
        await workerDetails.save();
        return res.status(200).redirect("/?success=Your+form+is+submitted+successfully.");
    } catch (error) {
        handleDatabaseError(res, error);
        return res.status(500).redirect("/?errro=Error+during+submission");
    }
};

function isValidEmail(email) {
    const emailChackString = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailChackString.test(email);
}

function isValidPhoneNumber(phone_number) {
    const phoneChackString = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    return phoneChackString.test(phone_number);
}

// ----------------- contact_us pages -------------------

const contact = (req, res) => {
    res.render('form/contact_us', {
        message: req.query.message,
        error: req.query.error,
        success: req.query.success
    });
};

const contact_form_submit = async (req, res) => {
    try {
        const { full_name, phone_number, email, message } = req.body;
        const newContact = await ContectUs.create({
            full_name,
            phone_number,
            email,
            message
        });

        if (newContact) {
            return res.status(200).redirect("/contactUs_form?success=Message+Sent+Successfully");
        } else {
            return res.status(500).redirect("/contactUs_form?error=Failed+to+send+message");
        }
    } catch (error) {
        handleDatabaseError(res, error);
    }
};

module.exports = { homePage, about_us, service, full_service_details, book_service, service_booking, printPage, searchBookedService, worker_details, show_worker_details, new_employees_form, new_employees_joining_form, contact, contact_form_submit, searchedServices };
