const express = require("express");
const usersRouter = require("./users");
const taskRouter = require("./tasks");
const commentRouter = require("./comments");
const notificationRouter = require("./notifications");

const router = express.Router();
router.use(usersRouter);
router.use(taskRouter);
router.use(commentRouter);
router.use(notificationRouter);

module.exports = router;