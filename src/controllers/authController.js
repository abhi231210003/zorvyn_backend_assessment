const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { User } = require("../models/User");

const signToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.status !== "active") {
    return res.status(403).json({ message: "Your account is inactive" });
  }

  const token = signToken(user);

  return res.status(200).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  return res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
};

module.exports = {
  login,
  getProfile,
};
