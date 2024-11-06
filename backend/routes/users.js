const express = require("express");
const { register, login, currentUser, removeUser, allUsers, followUser, unfolloweUser, getUser, updateUser } = require("../controllers/user");
const router = express.Router();

router.post('/register', register);
router.put('/login', login);
router.get('/current', currentUser);
router.get('/all', allUsers);
router.post('/follow/:userId', followUser);
router.post('/unfollow/:userId', unfolloweUser);
router.route('/:id').get(getUser).put(updateUser).delete(removeUser);

module.exports = router;