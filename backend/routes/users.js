const express = require("express");
const { register, login, currentUser, removeUser, allUsers, followUser, unfolloweUser } = require("../controllers/user");
const router = express.Router();

router.post('/api/users/register', register);
router.put('/api/users/login', login);
router.get('/api/users/current', currentUser);
router.delete('/api/users/:id', removeUser);
router.get('/api/users', allUsers);
router.post('/api/users/follow/:userId', followUser);
router.post('/api/users/unfollow/:userId', unfolloweUser);

module.exports = router;