const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { handleSocketEvents } = require("./config/SocketEvents.js");
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

handleSocketEvents(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));