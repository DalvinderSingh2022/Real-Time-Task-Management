const express = require("express");
const { addTask, allTasks, removeTask, updateTask } = require("../controllers/task");
const router = express.Router();

router.post('/api/tasks', addTask);
router.get('/api/tasks/:userId', allTasks);
router.route('/api/tasks/:id').put(updateTask).delete(removeTask);

module.exports = router;