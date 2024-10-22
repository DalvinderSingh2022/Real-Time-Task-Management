const { NotificationTypes, Notification } = require("../models/notification.model");
const validationHandler = require("../middleware/validationHandler");

// Task Assignment Notification
const taskAssign = async (req, res) => {
    const task = req.body.task;

    const message = `You have been assigned a new task: ${task.title} by ${task.assignedBy}.`;
    const data = { task };

    await generateNotification(task.assignedTo._id, message, NotificationTypes.TASK_ASSIGNMENT, data, res);
};

const allNotifications = async (req, res) => {
    try {
        // Find all notifications for current user 
        const userId = req.params.userId;

        const notifications = await Notification.find({ user: userId }).sort({ updatedAt: 'desc' });

        res.status(200).json({ message: 'All Notifications fetched successfully', notifications });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const generateNotification = async (user, message, type, data, res) => {
    const notification = new Notification({ user, message, type, data });

    try {
        await notification.save();

        return res.status(201).json({ message: 'Notification created successfully', notification });
    } catch (error) {
        validationHandler(error, res);
    }
}

module.exports = { taskAssign, allNotifications };