const Task = require('../models/task.model');
const Comment = require('../models/comment.model');

// Create a new task
const addTask = async (req, res) => {
    const { title, description, dueDate, assignedBy, assignedTo } = req.body;

    // Create a new Task instance
    const newTask = new Task({ title, description, dueDate, assignedTo, assignedBy });

    try {
        // Save the new task to the database
        // and Populate the assignedBy and assignedTo fields with the corresponding user data
        await newTask.save();
        const task = await newTask.populate([
            { path: 'assignedTo', select: '_id name avatar' },
            { path: 'assignedBy', select: '_id name avatar' }
        ]);

        return res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// Retrieve all tasks for a user
const allTasks = async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ message: "Missing requirements to process request" });
    }

    try {
        // Find all tasks that are assignedTo or assignedBy the current user (authState.user)
        // and Populate the assignedBy and assignedTo fields with the corresponding user data
        const tasks = await Task.find({ $or: [{ assignedTo: { $in: [userId] } }, { assignedBy: userId }] })
            .sort({ updatedAt: 'desc' })
            .populate([
                { path: 'assignedTo', select: '_id name avatar' },
                { path: 'assignedBy', select: '_id name avatar' }
            ]);

        res.status(200).json({ message: 'All Task fetched successfully', tasks });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// Retrieve a task
const getTask = async (req, res) => {
    const taskId = req.params.id;

    if (!taskId) {
        return res.status(400).json({ message: "Missing requirements to process request" });
    }

    try {
        // Retrieve the task with the given _id
        // and Populate the assignedBy and assignedTo fields with the corresponding user data
        const task = await Task.findById(taskId).populate([
            { path: 'assignedTo', select: '_id name avatar' },
            { path: 'assignedBy', select: '_id name avatar' }
        ]);

        if (!task) {
            return res.status(404).json({ message: "Task Not found" });
        }

        res.status(200).json({ message: 'Task fetched successfully', task });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// Delete a task
const removeTask = async (req, res) => {
    const taskId = req.params.id;

    if (!taskId) {
        return res.status(400).json({ message: "Missing requirements to process request" });
    }

    try {
        // Delete the task with the given _id 
        const [deletedTask] = await Promise.all([
            Task.findByIdAndDelete(taskId),
            Comment.deleteMany({ task: taskId })
        ]);

        // Check if the task was found and deleted
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(201).json({ message: "Task deleted Succesfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// Update a task
const updateTask = async (req, res) => {
    const taskId = req.params.id;
    const task = req.body;

    if (!taskId || !task) {
        return res.status(400).json({ message: "Missing requirements to process request" });
    }

    try {
        // Update the task with the new data 
        // and Populate the assignedBy and assignedTo fields with the corresponding user data
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            task,
            { new: true, runValidators: true, }
        ).populate([
            { path: 'assignedTo', select: '_id name avatar' },
            { path: 'assignedBy', select: '_id name avatar' }
        ]);

        return res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

module.exports = { allTasks, addTask, getTask, removeTask, updateTask };