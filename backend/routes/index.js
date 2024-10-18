const express = require("express");
const usersRouter = require("./users");
const taskRouter = require("./tasks");
const commentRouter = require("./comments");
const notificationRouter = require("./notifications");

const router = express.Router();
router.use('/users', usersRouter);
router.use('/tasks', taskRouter);
router.use('/comments', commentRouter);
router.use('/notifications', notificationRouter);

module.exports = router;