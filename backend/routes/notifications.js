const express = require("express");
const { allNotifications, updateNotification, removeNotification, taskUpdate, taskAssign, taskDelete, followUser, unFollowUser, dueDate, generateNotification } = require("../controllers/notifications");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.post('/due-date-reminder', dueDate, generateNotification);

router.use(authMiddleware);

router.get('/all', allNotifications);
router.route('/:id').put(updateNotification).delete(removeNotification);
router.post('/assign-task', taskAssign, generateNotification);
router.post('/update-task', taskUpdate, generateNotification);
router.post('/delete-task', taskDelete, generateNotification);
router.post('/follow-user', followUser, generateNotification);
router.post('/unfollow-user', unFollowUser, generateNotification);

module.exports = router;