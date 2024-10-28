const express = require("express");
const { register, login, currentUser, removeUser, allUsers, followUser, unfolloweUser, getUser } = require("../controllers/user");
const router = express.Router();

router.post('/register', register);
router.put('/login', login);
router.get('/current', currentUser);
router.get('/all', allUsers);
router.post('/follow/:userId', followUser);
router.post('/unfollow/:userId', unfolloweUser);
router.route('/:id').get(getUser).delete(removeUser);

module.exports = router;