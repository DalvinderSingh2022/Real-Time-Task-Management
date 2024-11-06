const { NotificationTypes, Notification } = require("../models/notification.model");
const mongoose = require("mongoose");

// Find all notifications for current user 
const allNotifications = async (req, res) => {
    try {
        const userId = req.params.userId;

        const notifications = await Notification.find({ user: userId }).sort({ updatedAt: 'desc' });

        res.status(200).json({ message: 'All Notifications fetched successfully', notifications });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
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
            { new: true, runValidators: true }
        );

        return res.status(200).json({ message: 'Notification updated successfully', updatedNotification });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
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
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// Task Assignment Notification
const taskAssign = async (req, res, next) => {
    const { task } = req.body;

    if (!task || !task.assignedBy || !task.assignedTo) {
        return res.status(400).send('Invalid task data');
    }

    req.message = `New Task: You have been assigned "${task.title}" by ${task.assignedBy.name}.`;
    req.data = { task };
    req.users = [task.assignedTo._id];
    req.type = NotificationTypes.TASK_ASSIGNMENT;

    next();
};

// Notification for Task Update
const taskUpdate = async (req, res, next) => {
    const { changes, task, oldTask } = req.body;

    if (!task || !changes) {
        return res.status(400).send('Invalid task update data');
    }

    req.message = `Task Update: The task "${task.title}" has been updated.`;
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

// Task Deletion Notification
const taskDelete = async (req, res, next) => {
    const { task } = req.body;

    if (!task || !task.assignedBy) {
        return res.status(400).send('Invalid task data');
    }

    req.message = `Task Deleted: The task "${task.title}" has been deleted by ${task.assignedBy.name}.`;
    req.data = { task };
    req.type = NotificationTypes.TASK_DELETED;

    const users = [task.assignedBy._id];
    if (task.assignedTo._id !== task.assignedBy._id) {
        users.push(task.assignedTo._id);
    }
    req.users = users;

    next();
};

// Notification for New Follower
const followUser = (req, res, next) => {
    const { authUser, userToFollow } = req.body;

    if (!authUser || !userToFollow) {
        return res.status(400).send('Invalid follow data');
    }

    req.type = NotificationTypes.USER_FOLLOW;
    req.users = [userToFollow._id];
    req.message = `${authUser.name} is now following you!`;
    req.data = { user: authUser };

    next();
};

// Notification for Unfollow
const unFollowUser = (req, res, next) => {
    const { authUser, userToUnfollow } = req.body;

    if (!authUser || !userToUnfollow) {
        return res.status(400).send('Invalid unfollow data');
    }

    req.type = NotificationTypes.USER_UNFOLLOW;
    req.users = [userToUnfollow._id];
    req.message = `${authUser.name} has unfollowed you.`;
    req.data = { user: authUser };

    next();
};

// Notification for Due Date Reminder
const dueDate = (req, res, next) => {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).send('Invalid tasks data');
    }

    req.type = NotificationTypes.DUE_DATE_REMINDER;
    req.users = [tasks[0].assignedTo];
    req.message = `Reminder: You have ${tasks.length} task(s) due today (${new Date().toDateString()}).`;
    req.data = { tasks };

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
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

module.exports = { allNotifications, updateNotification, removeNotification, taskAssign, taskUpdate, taskDelete, followUser, unFollowUser, dueDate, generateNotification };