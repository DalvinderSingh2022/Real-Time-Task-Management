const express = require("express");
const { register, login, currentUser, removeUser, allUsers, followUser, unfolloweUser } = require("../controllers/user");
const router = express.Router();

router.post('/register', register);
router.put('/login', login);
router.get('/current', currentUser);
router.delete('/:id', removeUser);
router.get('/all', allUsers);
router.post('/follow/:userId', followUser);
router.post('/unfollow/:userId', unfolloweUser);

module.exports = router;