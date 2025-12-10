const express = require("express");
const {
  addTask,
  allTasks,
  removeTask,
  updateTask,
  getTask,
} = require("../controllers/task");
const router = express.Router();

router.get("/all", allTasks);
router.post("/", addTask);
router.route("/:id").get(getTask).put(updateTask).delete(removeTask);

module.exports = router;
