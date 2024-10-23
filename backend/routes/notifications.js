const express = require("express");
const { taskAssign, allNotifications, updateNotification, removeNotification, taskUpdate } = require("../controllers/notifications");
const router = express.Router();

router.route('/:id').put(updateNotification).delete(removeNotification);
router.post('/assign-task', taskAssign);
router.post('/update-task', taskUpdate);
router.get('/all/:userId', allNotifications);

module.exports = router;