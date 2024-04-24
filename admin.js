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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
app.use(sessionMiddleware);

// Initialize connect-flash middleware
app.use(flash());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//for using public folder file 
const publicFolder = path.join(__dirname, 'public');
app.use(express.static(publicFolder));
app.set('view engine', 'hbs'); // Fixed typo

// use multer methods
app.use('/uploads', express.static('uploads'));
//template engine
app.engine('hbs', exphbs.engine({ // Removed unnecessary extension
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));

// route
const { loginPage, signupPage, adminDashboard, adminSignup, adminLogin } = require('./src/routes/admin/adminRoute')
app.get("/", loginPage);
app.get("/adSignup", signupPage);
app.get("/adDashboard", adminDashboard);

// post
app.post("/adSignup", adminSignup);
app.post("/login", adminLogin);

// app.use('/', require('./routes/AdminRoute/addService'));
// app.use('/', require('./routes/AdminRoute/adminRoute'));
// app.use('/', require('./routes/AdminRoute/bookingData'));
// app.use('/', require('./routes/AdminRoute/addNewEmloyee'));
// app.use('/', require('./routes/AdminRoute/ShowContactUs'));
// app.use('/', require('./routes/AdminRoute/addWorkProgress'));
// app.use('/', require('./routes/AdminRoute/Show_new_Worker_application'));

app.listen(port, () => {
    console.log(`server listening on port ${port}`.bgGreen.black.bold);
});
