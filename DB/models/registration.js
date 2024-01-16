const mongoose = require("mongoose");

const registerDetails = mongoose.Schema({
    first_name : {
        type : String,
        required : true
    },
    last_name : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        required:true
    },
    email : {
        type : String,
        required : true,
        unique: true
    },
    phone_number : {
        type : Number,
        required : true,
        unique: true
        
    },
    country : {
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    post_code : {
        type : Number,
        required : true
    },
    service : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    charge : {
        type : Number,
        required : true
    }


});
module.exports = mongoose.model("Register_details", registerDetails);