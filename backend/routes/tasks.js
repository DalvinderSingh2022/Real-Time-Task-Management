const express = require("express");
const { addTask, allTasks, removeTask, updateTask, getTask } = require("../controllers/task");
const router = express.Router();

router.post('/', addTask);
router.get('/all/:userId', allTasks);
router.route('/:id').get(getTask).put(updateTask).delete(removeTask);

module.exports = router;