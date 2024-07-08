const express = require("express");
const { addTask, allTasks, removeTask, updateTask } = require("../controllers/task");
const router = express.Router();

router.route('/api/tasks').post(addTask).get(allTasks);

router.route('/api/tasks/:id').put(updateTask).delete(removeTask);

module.exports = router;