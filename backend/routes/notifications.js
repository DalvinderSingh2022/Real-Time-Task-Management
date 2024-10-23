const express = require("express");
const { taskAssign, allNotifications, updateNotification, removeNotification, taskUpdate, generateNotification } = require("../controllers/notifications");
const router = express.Router();

router.route('/:id').put(updateNotification).delete(removeNotification);
router.post('/assign-task', taskAssign, generateNotification);
router.post('/update-task', taskUpdate, generateNotification);
router.get('/all/:userId', allNotifications);

module.exports = router;