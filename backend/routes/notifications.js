const express = require("express");
const { taskAssign, allNotifications } = require("../controllers/notifications");
const router = express.Router();

router.post('/assign-task', taskAssign);
router.get('/all/:userId', allNotifications);

module.exports = router;