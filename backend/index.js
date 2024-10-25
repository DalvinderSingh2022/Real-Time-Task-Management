const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { handleSocketEvents } = require("./config/SocketEvents.js");
const connectMongo = require("./config/Database.js");
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ORIGIN,
        methods: ["GET", "POST"]
    }
});

connectMongo();
handleSocketEvents(io);

app.use(cors());
app.use(express.json());
app.use('/api', routes);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));