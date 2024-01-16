const express = require('express');
const Router = express.Router();
const NewJoiningApply = require("../../DB/models/NewJoiningApply");

// show new all  empployee joining form
Router.get('/new_employee_details', async (req, res) => {
    try {
        const new_Employee_data = await NewJoiningApply.find().lean();
        res.render('./Admin/newEmployeeApplication/newEmployee', { new_Employee_data });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// show only one selected employee
Router.get('/new_employee_details:id', async (req, res) => {
    try {
        const new_Employee_full_data = await NewJoiningApply.findById(req.params.id).lean();
        const viewRelativePath = 'Admin/newEmployeeApplication/newEmployee_full_Profile';
        res.render(viewRelativePath, { new_Employee_full_data });

    } catch (error) {
        res.status(500).json({ error });
    }
});

// delete selected employee
Router.post('/delete_records/:id', async (req, res) => {
    try {
        await NewJoiningApply.findByIdAndDelete(req.params.id);
        res.redirect('/new_employee_details');
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = Router;
