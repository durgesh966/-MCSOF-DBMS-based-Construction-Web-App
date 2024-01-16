const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const cors = require("cors");
require('colors');
require('dotenv').config({ path: "./config/.env" });
require('./DB/connection/connection');
const session = require('express-session');
const bodyParser = require('body-parser');
const port = process.env.ADMIN_PORT || 9000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

//for using public folder file 
const publicFolder = path.join(__dirname, 'public');
app.use(express.static(publicFolder));
app.set('view engine', '.hbs');

// use multer methods
app.use('/uploads', express.static('uploads'));
//template engine
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));


app.use('/', require('./routes/AdminRoute/addService'));
app.use('/', require('./routes/AdminRoute/adminRoute'));
app.use('/', require('./routes/AdminRoute/bookingData'));
app.use('/', require('./routes/AdminRoute/addNewEmloyee'));
app.use('/', require('./routes/AdminRoute/ShowContactUs'));
app.use('/', require('./routes/AdminRoute/addWorkProgress'));
app.use('/', require('./routes/AdminRoute/Show_new_Worker_application'));

app.listen(port, () => {
    console.log(`server listening on port ${port}`.bgGreen.black.bold);
});