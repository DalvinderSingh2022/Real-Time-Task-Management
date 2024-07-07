const express = require("express");
const usersRouter = require("./users");

const router = express.Router();

router.use(usersRouter);

module.exports = router;