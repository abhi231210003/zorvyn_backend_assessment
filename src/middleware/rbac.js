const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Role ${req.user.role} is not allowed to perform this action`,
    });
  }

  next();
};

module.exports = authorize;
