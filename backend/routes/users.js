const express = require("express");
const {
  register,
  login,
  magicLogin,
  currentUser,
  removeUser,
  allUsers,
  followUser,
  unfollowUser,
  updateUser,
  approveUser,
  getPendingUsers,
} = require("../controllers/user");
const authMiddleware = require("../middleware/auth");
const rateLimit = require("../middleware/rateLimit");

const router = express.Router();

// Throttle unauthenticated auth endpoints to slow down brute-force attempts.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

router.post("/register", authLimiter, register);
router.put("/login", authLimiter, login);
router.put("/magic-login", authLimiter, magicLogin);

router.use(authMiddleware);

router.get("/current", currentUser);
router.get("/all", allUsers);
router.post("/follow/:userId", followUser);
router.post("/unfollow/:userId", unfollowUser);
router.route("/").put(updateUser).delete(removeUser);
router.put("/approve/:userId", approveUser);
router.get("/pending", getPendingUsers);

module.exports = router;
