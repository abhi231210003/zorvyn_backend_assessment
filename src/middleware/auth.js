const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { User } = require("../models/User");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid token user" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "User is inactive" });
    }

    req.user = {
      id: user._id,
      role: user.role,
      status: user.status,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
