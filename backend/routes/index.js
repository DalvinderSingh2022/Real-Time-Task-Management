const express = require("express");
const usersRouter = require("./users");
const taskRouter = require("./tasks");
const commentRouter = require("./comments");

const router = express.Router();
router.use(usersRouter);
router.use(taskRouter);
router.use(commentRouter);

module.exports = router;