const express = require("express");
const { allNotifications, updateNotification, removeNotification, taskUpdate, taskAssign, taskDelete, followUser, unFollowUser, dueDate, generateNotification } = require("../controllers/notifications");
const router = express.Router();

router.get('/all', allNotifications);
router.route('/:id').put(updateNotification).delete(removeNotification);
router.post('/assign-task', taskAssign, generateNotification);
router.post('/update-task', taskUpdate, generateNotification);
router.post('/delete-task', taskDelete, generateNotification);
router.post('/follow-user', followUser, generateNotification);
router.post('/unfollow-user', unFollowUser, generateNotification);
router.post('/due-date-reminder', dueDate, generateNotification);

module.exports = router;