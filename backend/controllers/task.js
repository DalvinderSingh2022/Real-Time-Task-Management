
const Task = require('../models/task.model');
const validationHandler = require('../middleware/validationHandler');

// Create a new task
const addTask = async (req, res) => {
    const { title, description, dueDate, assignedBy, assignedTo } = req.body;

    // Create a new Task instance
    const newTask = new Task({ title, description, dueDate, assignedTo, assignedBy });

    try {
        // Save the new task to the database
        // and Populate the assignedBy and assignedTo fields with the corresponding user data
        await newTask.save();
        const task = await newTask.populate(['assignedBy', 'assignedTo']);
        return res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        validationHandler(error, res);
    }
};

// Retrieve all tasks for a user
const allTasks = async (req, res) => {
    try {
        // Find all tasks that are assignedTo or assignedBy the current user (authState.user)
        // and Populate the assignedBy and assignedTo fields with the corresponding user data
        const tasks = await Task.find({
            $or: [
                { assignedTo: req.params.userId },
                { assignedBy: req.params.userId }
            ]
        }).populate(['assignedBy', 'assignedTo']);

        res.status(200).json({ message: 'All Task fetched successfully', tasks });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// Delete a task
const removeTask = async (req, res) => {
    try {
        // Delete the task with the given _id
        await Task.deleteOne({ _id: req.params.id });

        return res.status(201).json({ message: "Task deleted Succesfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update a task
const updateTask = async (req, res) => {
    // Find the task with the given _id
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(400).json({ message: "Something went wrong while updating task" });
        }

        // Update the task with the new data 
        // and Populate the assignedBy and assignedTo fields with the corresponding user data
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate(['assignedBy', 'assignedTo']);

        return res.status(200).json({ message: 'Task updated successfully', updatedTask });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { addTask, allTasks, removeTask, updateTask };