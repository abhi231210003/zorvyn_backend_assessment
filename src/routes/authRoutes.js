const express = require("express");
const { body } = require("express-validator");
const { login, getProfile } = require("../controllers/authController");
const authenticate = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/login", (req, res) => {
  return res.status(405).json({
    message: "Use POST /api/auth/login with email and password in JSON body",
  });
});

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password is required"),
  ],
  validate,
  login
);

router.get("/me", authenticate, getProfile);

module.exports = router;
