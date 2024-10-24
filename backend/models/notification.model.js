const mongoose = require("mongoose");

const NotificationTypes = {
    TASK_UPDATE: 'Task_update',
    TASK_DELETED: 'Task_deleted',
    TASK_ASSIGNMENT: 'Task_assignment',
    USER_FOLLOW: 'User_follow',
    USER_UNFOLLOW: 'USer_unfollow',
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

const Notification = mongoose.model("Notification", NotificationSchema);

(async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    try {
        const notifications = await Notification.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
        console.log(notifications);
    } catch (error) {
        console.error(error);
    }
})();

module.exports = { Notification, NotificationTypes };