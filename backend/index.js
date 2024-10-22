const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectMongo = require("./config/Database.js");
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

connectMongo();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

io.on("connection", (socket) => {
    console.log("user connected : " + socket.id);

    socket.on('user_followed', (authUser, userToFollow) => {
        io.emit('user_followed', authUser, userToFollow);
    });

    socket.on('user_unfollowed', (authUser, userToUnfollow) => {
        io.emit('user_unfollowed', authUser, userToUnfollow);
    });

    socket.on('task_created', (task, notification) => {
        io.emit('task_created', task);
        addNotification(notification);
    });

    socket.on('task_updated', (task, user) => {
        io.in(task._id).emit('task_updated', task, user);
    });

    socket.on('task_deleted', (task, assignedTo, assignedBy) => {
        io.in(task._id).emit('task_deleted', task, assignedTo, assignedBy);
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

    socket.on("disconnect", () => {
        console.log("disconnected : " + socket.id);
    });
});

const addNotification = (notification) => {
    switch (notification.type) {
        case 'TASK_ASSIGNMENT':
            io.in(notification.data.task.assignedTo._id).emit('new_notification', notification);
            break;
    }
};

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));