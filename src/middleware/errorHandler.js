const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid id format" });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "Duplicate value exists" });
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  return res.status(statusCode).json({ message });
};

module.exports = {
  notFound,
  errorHandler,
};
