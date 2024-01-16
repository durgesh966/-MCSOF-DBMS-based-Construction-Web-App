const express = require('express');
const Router = express.Router();
const WorkDetails = require("../../DB/models/WorkDetails");

// Route to render the form
Router.get('/add_working_details', async (req, res) => {
    try {
        const show_Work_details = await WorkDetails.find().lean();
        res.render('./Admin/service/add_Work_Details', { show_Work_details });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// add new work details and update existing data
Router.post('/add_working_details', async (req, res) => {
    try {
        const { docID, update_new_task, update_task_completed, update_team_members, update_customers } = req.body;
        if (docID) {
            if (!docID || !update_new_task || !update_task_completed || !update_team_members || !update_customers) {
                return res.status(404).send('<script>Swal.fire("Error", "Update Data not found", "error");</script>');
            };
            const updateData = {
                new_task: update_new_task,
                task_completed: update_task_completed,
                team_members: update_team_members,
                customers: update_customers
            };
            const updatedWorkDetails = await WorkDetails.findByIdAndUpdate(docID, updateData, { new: true });
            if (!updatedWorkDetails) {
                return res.status(404).send('<script>Swal.fire("Error", "Work Data not found", "error");</script>');
            }
            return res.status(200).send('<script>Swal.fire("Success", "Work Data updated successfully", "success").then(() => { window.location.href = "/add_working_details"; });</script>');
        } else {
            const { new_task, task_completed, team_members, customers } = req.body;
            if (!new_task || !task_completed || !team_members || !customers) {
                return res.status(404).send('<script>Swal.fire("Error", "Data not found", "error");</script>');
            };
            await WorkDetails.create({
                new_task,
                task_completed,
                team_members,
                customers
            });
            return res.status(200).send('<script>Swal.fire("Success", "Work Data added successfully", "success").then(() => { window.location.href = "/add_working_details"; });</script>');
        }
    } catch (error) {
        let errorMessage = 'Internal Server Error. Please fill in all input fields.';

        if (error.name === 'ValidationError') {
            errorMessage = 'Validation Error. Please check your input data.';
        } else if (error.code === 11000) {
            errorMessage = 'Duplicate entry. The provided email or phone number is already registered.';
        }
        return res.status(500).send(`<script>Swal.fire("Error", "${errorMessage}", "error");</script>`);
    }
});

module.exports = Router;