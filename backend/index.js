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
app.use(routes);

io.on("connection", (socket) => {
    console.log("user connected : " + socket.id);

    socket.on('user_followed', (authUser, userToFollow) => {
        io.emit('user_followed', authUser, userToFollow);
    });

    socket.on('user_unfollowed', (authUser, userToUnfollow) => {
        io.emit('user_unfollowed', authUser, userToUnfollow);
    });

    socket.on('task_created', (task) => {
        io.emit('task_created', task);
    });

    socket.on('task_updated', (task) => {
        io.emit('task_updated', task);
    });

    socket.on('task_deleted', (taskId, assignedTo, assignedBy) => {
        io.emit('task_deleted', taskId, assignedTo, assignedBy);
    });

    socket.on('user_disconnected', (userId) => {
        socket.emit('user_disconnected', userId);
    });

    socket.on('user_connected', (user, token) => {
        socket.emit('user_connected', user, token);
    });

    socket.on("disconnect", () => {
        console.log("disconnected : " + socket.id);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));