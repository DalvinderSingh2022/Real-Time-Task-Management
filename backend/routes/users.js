const express = require("express");
const {
  register,
  login,
  magicLogin,
  currentUser,
  removeUser,
  allUsers,
  followUser,
  unfolloweUser,
  updateUser,
} = require("../controllers/user");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.put("/login", login);
router.put("/magic-login", magicLogin);

router.use(authMiddleware);

router.get("/current", currentUser);
router.get("/all", allUsers);
router.post("/follow/:userId", followUser);
router.post("/unfollow/:userId", unfolloweUser);
router.route("/").put(updateUser).delete(removeUser);

module.exports = router;
