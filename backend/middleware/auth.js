const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers?.Authorization || req.headers?.authorization;

  // Return an error response if JWT token is missing
  if (!token) {
    return res
      .status(401)
      .json({ message: "You need to be logged in to access this resource." });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res
      .status(401)
      .json({
        message: "Your session has expired or is invalid. Please log in again.",
      });
  }
};

module.exports = authMiddleware;
