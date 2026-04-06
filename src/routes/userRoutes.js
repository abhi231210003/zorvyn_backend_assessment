const express = require("express");
const { body, param, query } = require("express-validator");
const {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/rbac");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["viewer", "analyst", "admin"])
      .withMessage("Role must be viewer, analyst, or admin"),
    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Status must be active or inactive"),
  ],
  validate,
  createUser
);

router.get(
  "/",
  [
    query("role")
      .optional()
      .isIn(["viewer", "analyst", "admin"])
      .withMessage("Invalid role filter"),
    query("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Invalid status filter"),
  ],
  validate,
  listUsers
);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid user id")],
  validate,
  getUserById
);

router.patch(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid user id"),
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("role")
      .optional()
      .isIn(["viewer", "analyst", "admin"])
      .withMessage("Role must be viewer, analyst, or admin"),
    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Status must be active or inactive"),
  ],
  validate,
  updateUser
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid user id")],
  validate,
  deleteUser
);

module.exports = router;
