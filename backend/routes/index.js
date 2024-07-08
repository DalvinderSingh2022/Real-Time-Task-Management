const express = require("express");
const usersRouter = require("./users");
const taskRouter = require("./tasks");

const router = express.Router();
router.use(usersRouter);
router.use(taskRouter);

module.exports = router;