const mongoose = require('mongoose');
require('colors');

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('MongoDB connection Success'.bgBlue.bold);
}).catch((error) => {
    console.log(`MongoDB connection error ${error}`.bgRed.black);
});