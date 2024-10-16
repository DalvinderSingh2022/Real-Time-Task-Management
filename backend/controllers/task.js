
const Task = require('../models/task.model');
const Comment = require('../models/comment.model');
const mongoose = require('mongoose');
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
        await newTask.populate({ path: 'assignedTo', select: '_id name' })
        const task = await newTask.populate({ path: 'assignedBy', select: '_id name' });

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
        const userId = req.params.userId;

        const tasks = await Task.find({
            $or: [{ assignedTo: userId }, { assignedBy: userId }]
        })
            .sort({ updatedAt: 'desc' })
            .populate([
                { path: 'assignedTo', select: '_id name' },
                { path: 'assignedBy', select: '_id name' }
            ]);

        res.status(200).json({ message: 'All Task fetched successfully', tasks });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Retrieve a task
const getTask = async (req, res) => {
    try {
        // Retrieve the task with the given _id
        // and Populate the assignedBy and assignedTo fields with the corresponding user data
        const taskId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid Id Task Not found" });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task Not found" });
        }

        await task.populate([
            { path: 'assignedTo', select: '_id name' },
            { path: 'assignedBy', select: '_id name' }
        ]);

        res.status(200).json({ message: 'Task fetched successfully', task });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete a task
const removeTask = async (req, res) => {
    try {
        // Delete the task with the given _id 
        const taskId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid Id Task Not found" });
        }

        await Task.findByIdAndDelete(taskId);
        await Comment.deleteMany({ task: taskId });

        return res.status(201).json({ message: "Task deleted Succesfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update a task
const updateTask = async (req, res) => {
    // Find the task with the given _id
    const taskId = req.params.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid Id Task Not found" });
        }

        // Update the task with the new data 
        // and Populate the assignedBy and assignedTo fields with the corresponding user data
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            req.body,
            { new: true }
        ).populate([
            { path: 'assignedTo', select: '_id name' },
            { path: 'assignedBy', select: '_id name' }
        ]);

        return res.status(200).json({ message: 'Task updated successfully', updatedTask });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { allTasks, addTask, getTask, removeTask, updateTask };