const { NotificationTypes } = require("../models/notification.model");

const handleSocketEvents = (io) => {
    io.on("connection", (socket) => {
        console.log("user connected : " + socket.id);

        socket.on('user_followed', (authUser, userToFollow, notification) => {
            io.emit('user_followed', authUser, userToFollow);
            addNotification({ notification });
        });

        socket.on('user_unfollowed', (authUser, userToUnfollow, notification) => {
            io.emit('user_unfollowed', authUser, userToUnfollow);
            addNotification({ notification });
        });

        socket.on('task_created', (task, notification) => {
            io.emit('task_created', task);
            addNotification({ notification });
        });

        socket.on('task_updated', (task, user, notification, oldTask) => {
            io.emit('task_updated', task, user);
            addNotification({ notification, task, oldTask });
        });

        socket.on('task_deleted', (task, assignedTo, assignedBy, notification) => {
            io.emit('task_deleted', task, assignedTo, assignedBy);
            addNotification({ notification });
        });

        socket.on('user_left', user => {
            io.emit('user_left', user);
        });

        socket.on('user_join', user => {
            io.emit('user_join', user);
        });

        socket.on("join_room", id => {
            socket.join(id);
        });

        socket.on("leave_room", id => {
            socket.leave(id);
        });

        socket.on("send_comment", (comment, id) => {
            io.in(id).emit('update_comments', comment);
        });

        socket.on('disconnect', (reason) => {
            console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
        });
    });

    const addNotification = (payload) => {
        const { notification } = payload;

        if (notification.type === NotificationTypes.TASK_ASSIGNMENT) {
            const { task } = notification.data;

            io.in(task.assignedTo._id).emit('new_notification', notification);
        }

        if (notification.type === NotificationTypes.TASK_UPDATE) {
            const { task, oldTask } = payload;

            io.in(task.assignedTo._id).emit('new_notification', notification);

            if (task.assignedTo._id !== task.assignedBy._id) {
                io.in(task.assignedBy._id).emit('new_notification', notification);
            }
            if (task.assignedTo._id !== oldTask.assignedTo._id) {
                io.in(oldTask.assignedTo._id).emit('new_notification', notification);
            }
        }

        if (notification.type === NotificationTypes.USER_FOLLOW || notification.type === NotificationTypes.USER_UNFOLLOW) {
            const id = notification.user;

            io.in(id).emit('new_notification', notification);
        }

        if (notification.type == NotificationTypes.TASK_DELETED) {
            const { task } = notification.data;

            io.in(task.assignedBy._id).emit('new_notification', notification);
            if (task.assignedTo._id !== task.assignedBy._id) {
                io.in(task.assignedTo._id).emit('new_notification', notification);
            }
        }
    };
}

module.exports = { handleSocketEvents };