const mongoose = require("mongoose");

const NotificationTypes = {
  TASK_UPDATE: "Task update",
  TASK_DELETED: "Task deleted",
  TASK_ASSIGNMENT: "Task assignment",
  USER_FOLLOW: "User follow",
  USER_UNFOLLOW: "User unfollow",
  DUE_DATE_REMINDER: "Due date reminder",
  // USER_MENTION: 'User mention',
  // SYSTEM_ALERT: 'System alert',
};

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  type: {
    type: String,
    required: [true, "Notification type is required"],
    enum: {
      values: Object.values(NotificationTypes),
      message: "Invalid notification type",
    },
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  read: {
    type: Boolean,
    required: [true, "Read status is required"],
    default: false,
  },
  data: {
    type: Object,
    required: [true, "Data is required"],
  },
  createdAt: {
    type: Date,
    required: [true, "CreatedAt is required"],
    expires: "30d",
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = { Notification, NotificationTypes };
