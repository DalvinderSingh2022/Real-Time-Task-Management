const express = require("express");
const { addTask, allTasks, removeTask, updateTask, getTask } = require("../controllers/task");
const router = express.Router();

router.post('/api/tasks', addTask);
router.get('/api/tasks/all/:userId', allTasks);
router.route('/api/tasks/:id').get(getTask).put(updateTask).delete(removeTask);

module.exports = router;