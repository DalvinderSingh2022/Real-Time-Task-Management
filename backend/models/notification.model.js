const mongoose = require("mongoose");

const NotificationTypes = {
    TASK_UPDATE: 'TASK_UPDATE',
    TASK_DELETED: 'TASK_DELETED',
    TASK_ASSIGNMENT: 'TASK_ASSIGNMENT',
    USER_FOLLOW: 'USER_FOLLOW',
    USER_UNFOLLOW: 'USER_UNFOLLOW',
    // COMMENT: 'COMMENT',
    // DUE_DATE_REMINDER: 'DUE_DATE_REMINDER',
    // USER_MENTION: 'USER_MENTION',
    // SYSTEM_ALERT: 'SYSTEM_ALERT',
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