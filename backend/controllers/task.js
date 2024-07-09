
const Task = require('../models/task.model');
const validationHandler = require('../middleware/validationHandler');

const addTask = async (req, res) => {
    const { title, description, dueDate, assignedBy, assignedTo } = req.body;

    const task = new Task({ title, description, dueDate, assignedTo, assignedBy });

    try {
        await task.save();
        return res.status(201).json({ message: 'Task created successfully', task });
    } catch (err) {
        validationHandler(err, res);
    }
};

const allTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate(['assignedBy', 'assignedTo']);

        res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const removeTask = async (req, res) => {
    try {
        await Task.deleteOne({ _id: req.params.id });

        return res.status(201).json({ message: "Task deleted Succesfully" });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(400).json({ message: "Invalid task id provided" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    return res.status(200).json(updatedTask);
};

module.exports = { addTask, allTasks, removeTask, updateTask };