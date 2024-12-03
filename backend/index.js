const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");
const { handleSocketEvents } = require("./config/SocketEvents.js");
const connectMongo = require("./config/Database.js");
const http = require('http');
const { Server } = require('socket.io');
require("dotenv").config();

const PORT = process.env.PORT;
const ORIGIN = process.env.ORIGIN;

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