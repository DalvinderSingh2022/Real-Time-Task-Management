const mongoose = require("mongoose");

const NotificationTypes = {
    TASK_UPDATE: 'task_update',
    COMMENT: 'comment',
    FOLLOW: 'follow',
    UNFOLLOW: 'unfollow',
    TASK_ASSIGNMENT: 'task_assignment',
    TASK_COMPLETION: 'task_completion',
    // DUE_DATE_REMINDER: 'due_date_reminder',
    // USER_MENTION: 'user_mention',
    // SYSTEM_ALERT: 'system_alert',
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
        type: String,
        required: true
    },
}, {
    timestamps: true
});

setInterval(async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    try {
        await Notification.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
    } catch (error) {
        console.error(error);
    }
}, 24 * 60 * 60 * 1000);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = { Notification, NotificationTypes };