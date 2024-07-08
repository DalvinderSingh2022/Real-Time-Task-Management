const express = require("express");
const { register, login, currentUser, removeUser } = require("../controllers/user");
const router = express.Router();

router.post('/api/users/register', register);
router.put('/api/users/login', login);
router.get('/api/users/current', currentUser);
router.delete('/api/users/:id', removeUser);

module.exports = router;