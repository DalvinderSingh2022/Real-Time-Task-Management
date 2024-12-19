const mongoose = require("mongoose");

const NotificationTypes = {
    TASK_UPDATE: 'Task update',
    TASK_DELETED: 'Task deleted',
    TASK_ASSIGNMENT: 'Task assignment',
    USER_FOLLOW: 'User follow',
    USER_UNFOLLOW: 'User unfollow',
    DUE_DATE_REMINDER: 'Due date reminder',
    // USER_MENTION: 'User mention',
    // SYSTEM_ALERT: 'System alert',
};

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User '
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(NotificationTypes)
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    data: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        expires: '30d',
        default: Date.now
    }
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = { Notification, NotificationTypes };