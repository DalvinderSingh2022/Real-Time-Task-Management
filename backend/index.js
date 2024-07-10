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

    socket.on('user_followed', (authUser, userToFollow, message) => {
        io.emit('user_followed', authUser, userToFollow, message);
    });

    socket.on('user_unfollowed', (authUser, userToUnfollow, message) => {
        io.emit('user_unfollowed', authUser, userToUnfollow, message);
    });

    socket.on('task_created', (task, message) => {
        io.emit('task_created', task, message);
    });

    socket.on('task_updated', (task, message) => {
        io.emit('task_updated', task, message);
    });

    socket.on('task_deleted', (taskId, assignedTo, assignedBy, message) => {
        io.emit('task_deleted', taskId, assignedTo, assignedBy, message);
    });

    socket.on("disconnect", () => {
        console.log("disconnected : " + socket.id);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));