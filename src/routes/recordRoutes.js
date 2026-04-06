const express = require("express");
const { body, param, query } = require("express-validator");
const {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/rbac");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(authenticate);

router.get(
  "/",
  [
    query("type")
      .optional()
      .isIn(["income", "expense"])
      .withMessage("Type must be income or expense"),
    query("startDate")
      .optional()
      .isISO8601()
      .withMessage("startDate must be a valid date"),
    query("endDate").optional().isISO8601().withMessage("endDate must be a valid date"),
    query("minAmount")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("minAmount must be a positive number"),
    query("maxAmount")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("maxAmount must be a positive number"),
  ],
  validate,
  listRecords
);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid record id")],
  validate,
  getRecordById
);

router.post(
  "/",
  authorize("admin"),
  [
    body("amount")
      .isFloat({ gt: 0 })
      .withMessage("Amount must be a number greater than zero"),
    body("type")
      .isIn(["income", "expense"])
      .withMessage("Type must be income or expense"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("date").isISO8601().withMessage("Date must be a valid date"),
    body("notes").optional().isString().withMessage("Notes must be text"),
  ],
  validate,
  createRecord
);

router.patch(
  "/:id",
  authorize("admin"),
  [
    param("id").isMongoId().withMessage("Invalid record id"),
    body("amount")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Amount must be a number greater than zero"),
    body("type")
      .optional()
      .isIn(["income", "expense"])
      .withMessage("Type must be income or expense"),
    body("category").optional().trim().notEmpty().withMessage("Category cannot be empty"),
    body("date").optional().isISO8601().withMessage("Date must be a valid date"),
    body("notes").optional().isString().withMessage("Notes must be text"),
  ],
  validate,
  updateRecord
);

router.delete(
  "/:id",
  authorize("admin"),
  [param("id").isMongoId().withMessage("Invalid record id")],
  validate,
  deleteRecord
);

module.exports = router;
