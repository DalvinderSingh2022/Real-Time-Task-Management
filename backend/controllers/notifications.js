const { NotificationTypes, Notification } = require("../models/notification.model");
const validationHandler = require("../middleware/validationHandler");

// Task Assignment Notification
const taskAssign = async (req, res) => {
    const task = req.body.task;

    const message = `You have been assigned a new task: ${task.title} by ${task.assignedBy}.`;
    const data = { task };

    await generateNotification(task.assignedTo._id, message, NotificationTypes.TASK_ASSIGNMENT, data);
};

const generateNotification = async (user, message, type, data) => {
    const notification = new Notification({ user, message, type, data });
    try {
        await notification.save();

        return res.status(201).json({ message: 'Notification created successfully', notification });
    } catch (error) {
        validationHandler(error, res);
    }
}

module.exports = { taskAssign };