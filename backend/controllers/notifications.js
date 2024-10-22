const { NotificationTypes, Notification } = require("../models/notification.model");
const validationHandler = require("../middleware/validationHandler");
const mongoose = require("mongoose");

// Find all notifications for current user 
const allNotifications = async (req, res) => {
    try {
        const userId = req.params.userId;

        const notifications = await Notification.find({ user: userId }).sort({ updatedAt: 'desc' });

        res.status(200).json({ message: 'All Notifications fetched successfully', notifications });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update a Notification
const updateNotification = async (req, res) => {
    // Find the Notification with the given _id
    const notificationId = req.params.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({ message: "Invalid Id Notification Not found" });
        }
        // Update the Notification with the new data
        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            req.body,
            { new: true }
        );

        return res.status(200).json({ message: 'Notification updated successfully', updatedNotification });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// Delete a Notification
const removeNotification = async (req, res) => {
    try {
        // Delete the Notification with the given _id
        const notificationId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({ message: "Invalid Id Notification Not found" });
        }

        await Notification.findByIdAndDelete(notificationId);

        res.status(200).json({ message: "Notification deleted Succesfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Task Assignment Notification
const taskAssign = async (req, res) => {
    const task = req.body.task;

    const message = `You have been assigned a new task: ${task.title} by ${task.assignedBy.name}.`;
    const data = { task };

    await generateNotification(task.assignedTo._id, message, NotificationTypes.TASK_ASSIGNMENT, data, res);
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

module.exports = { taskAssign, allNotifications, updateNotification, removeNotification };