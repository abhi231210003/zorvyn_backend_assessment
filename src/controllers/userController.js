const { User, roles, statuses } = require("../models/User");

const createUser = async (req, res) => {
  const { name, email, password, role, status } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
    status,
  });

  return res.status(201).json({
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

const listUsers = async (req, res) => {
  const { role, status, page = 1, limit = 20 } = req.query;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  const query = {};
  if (role && roles.includes(role)) {
    query.role = role;
  }
  if (status && statuses.includes(status)) {
    query.status = status;
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),
    User.countDocuments(query),
  ]);

  return res.status(200).json({
    page: parsedPage,
    limit: parsedLimit,
    total,
    users,
  });
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user });
};

const updateUser = async (req, res) => {
  const { name, role, status } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (name !== undefined) {
    user.name = name;
  }

  if (role !== undefined) {
    user.role = role;
  }

  if (status !== undefined) {
    user.status = status;
  }

  await user.save();

  return res.status(200).json({ user });
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();
  return res.status(200).json({ message: "User deleted successfully" });
};

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};
