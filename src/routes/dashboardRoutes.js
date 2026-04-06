const express = require("express");
const { getSummary } = require("../controllers/dashboardController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/rbac");

const router = express.Router();

router.get("/summary", authenticate, authorize("viewer", "analyst", "admin"), getSummary);

module.exports = router;
