const express = require("express");
const { taskAssign } = require("../controllers/notifications");
const router = express.Router();

router.post('/assign-task', taskAssign);

module.exports = router;