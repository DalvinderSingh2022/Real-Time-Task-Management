const { NotificationTypes, Notification } = require("../models/notification.model");
const validationHandler = require("../middleware/validationHandler");
const mongoose = require("mongoose");

// Find all notifications for current user 
const allNotifications = async (req, res) => {
    try {
        const userId = req.params.userId;

        const notifications = await Notification.find({ user: userId }).sort({ updatedAt: 'asc' });

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
const taskAssign = async (req, res, next) => {
    const { task } = req.body;

    req.message = `You have been assigned a new task: ${task.title} by ${task.assignedBy.name}.`;
    req.data = { task };
    req.users = [task.assignedTo._id];
    req.type = NotificationTypes.TASK_ASSIGNMENT;

    next();
};

// Notification for Task update
const taskUpdate = async (req, res, next) => {
    const { changes, task, oldTask } = req.body;

    req.message = `Task ${task._id} has been updated.`;
    req.data = { changes, task };
    req.type = NotificationTypes.TASK_UPDATE;

    const users = [task.assignedTo._id];
    if (task.assignedTo._id !== task.assignedBy._id) {
        users.push(task.assignedBy._id);
    }
    if (task.assignedTo._id !== oldTask.assignedTo._id) {
        users.push(oldTask.assignedTo._id);
    }
    req.users = users;

    next();
};

// Notification for new follower
const followUser = (req, res, next) => {
    const { authUser, userToFollow } = req.body;

    req.type = NotificationTypes.FOLLOW;
    req.users = [userToFollow._id];
    req.message = `${authUser.name} started following you.`;
    req.data = { user: authUser };

    next();
};

const unFollowUser = (req, res, next) => {
    const { authUser, userToUnfollow } = req.body;

    req.type = NotificationTypes.UNFOLLOW;
    req.users = [userToUnfollow._id];
    req.message = `${authUser.name} has unfollowed you.`;
    req.data = { user: authUser };

    next();
};
const generateNotification = async (req, res) => {
    const { users, message, type, data } = req;

    try {
        const notificationPromises = users.map(user => {
            const notification = new Notification({ user, message, type, data });
            return notification.save();
        });

        const notifications = await Promise.all(notificationPromises);

        return res.status(201).json({ message: 'Notifications created successfully', notifications, });
    } catch (error) {
        validationHandler(error, res);
    }
}

module.exports = { allNotifications, updateNotification, removeNotification, taskAssign, taskUpdate, followUser, unFollowUser, generateNotification };