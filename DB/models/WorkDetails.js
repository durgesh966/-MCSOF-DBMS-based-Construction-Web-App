const mongoose = require("mongoose");

const WorkDetails = new mongoose.Schema({
    new_task: {
        type: Number,
        required: true,
    },
    task_completed: {
        type: Number,
        required: true,
    },
    team_members: {
        type: Number,
        required: true,
    },
    customers: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Work_Details", WorkDetails);
