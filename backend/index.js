const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectMongo = require("./config/Database.js");

connectMongo();
const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);
app.listen(process.env.PORT);