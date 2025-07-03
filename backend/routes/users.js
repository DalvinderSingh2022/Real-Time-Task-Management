const express = require("express");
const { register, login, currentUser, removeUser, allUsers, followUser, unfolloweUser, updateUser } = require("../controllers/user");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post('/register', register);
router.put('/login', login);


router.use(authMiddleware);

router.get('/all', allUsers);
router.get('/current', currentUser);
router.post('/follow/:userId', followUser);
router.post('/unfollow/:userId', unfolloweUser);
router.route('/').put(updateUser).delete(removeUser);

module.exports = router;