const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const cors = require("cors");
require('colors');
require('dotenv').config({ path: "./config/.env" });
require('./DB/connection/connection');
const port = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//for using public folder file 
const publicFolder = path.join(__dirname, 'public');
app.use(express.static(publicFolder));

// use multer methods
app.use('/uploads', express.static('uploads'));

//template engine
app.engine('.hbs', exphbs.engine({ extname: '.hbs', }));
app.set('view engine', '.hbs');

app.use('/', require('./routes/userRoute/main'));
app.use('/', require('./routes/userRoute/showWorker'));
app.use('/', require('./routes/userRoute/showService'));
app.use('/', require('./routes/userRoute/workProgress'));
app.use('/', require('./routes/userRoute/ContactUsForm'));
app.use('/', require('./routes/userRoute/new_Worker_application'));

app.listen(port, () => {
    console.log(`server listening on port ${port}`.bgGreen.black.bold);
});