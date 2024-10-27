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
}, {
    timestamps: true
});

const Notification = mongoose.model("Notification", NotificationSchema);

setInterval(() => async () => {
    try {
        if (new Date().getHours() === 0) {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const result = await Notification.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
            console.log(result);
        }
    } catch (error) {
        console.error(error);
    }
}, 60 * 60 * 1000);

module.exports = { Notification, NotificationTypes };