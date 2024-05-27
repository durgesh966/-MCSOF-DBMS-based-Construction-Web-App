const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const cors = require("cors");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
require('colors');
require('dotenv').config({ path: "./config/.env" });
require('./DB/connection/connection');
const bodyParser = require('body-parser');
const port = process.env.ADMIN_PORT || 9000;

// MongoDB for session storage
const mongoStoreOptions = {
    mongoUrl: process.env.MONGO_URL,
    collection: 'sessions',
};

// Set up session middleware
const sessionMiddleware = session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    // store: MongoStore.create(mongoStoreOptions),
    cookie: { maxAge: 600000 },
});
app.use(sessionMiddleware);

// Initialize connect-flash middleware
app.use(flash());

// Body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));

// Route paths
const {
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
} = require('./src/routes/admin/adminRoute');

app.get("/", loginPage);
app.get("/adSignup", signupPage);
app.get("/adDashboard", adminDashboard);
app.get("/booking_work_data", bookWorkData);
app.get("/booking_work_full_data:id", bookedWorkFullData);
app.get("/show_all_contacts", showAllContacts);
app.get("/show_search_contact", searchContact);
app.get("/new_employee_details", newEmployeeApplyData);
app.get("/new_employee_details:id", newEmployeeApplyFullData);
app.get("/add-services", addServices);
app.get("/add_working_details", showWorkData);
app.get("/registration_worker", registerWorker);

// Post routes
app.post("/adSignup", adminSignup);
app.post("/", adminLogin);
app.post("/delete_booked_data:id", deleteBookData);
app.post("/delete/:id", deleteContacts);
app.post("/delete_records/:id", deleteEmployeeApplyData);
app.post("/add-services", uploadNewServices);
app.post("/add_working_details", addWorkData);
app.post("/update_working_details", updateWorkData);
app.post("/registration_worker", registerWorkerFormSubmit);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`.bgGreen.black.bold);
});
