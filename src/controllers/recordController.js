const { Record } = require("../models/Record");

const createRecord = async (req, res) => {
  const record = await Record.create({
    ...req.body,
    createdBy: req.user.id,
  });

  return res.status(201).json({ record });
};

const listRecords = async (req, res) => {
  const {
    type,
    category,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    page = 1,
    limit = 20,
  } = req.query;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const query = {};
  if (type) {
    query.type = type;
  }

  if (category) {
    query.category = category;
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      query.date.$gte = new Date(startDate);
    }
    if (endDate) {
      query.date.$lte = new Date(endDate);
    }
  }

  if (minAmount || maxAmount) {
    query.amount = {};
    if (minAmount) {
      query.amount.$gte = Number(minAmount);
    }
    if (maxAmount) {
      query.amount.$lte = Number(maxAmount);
    }
  }

  const [records, total] = await Promise.all([
    Record.find(query)
      .populate("createdBy", "name email role")
      .sort({ date: -1, createdAt: -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit),
    Record.countDocuments(query),
  ]);

  return res.status(200).json({
    page: parsedPage,
    limit: parsedLimit,
    total,
    records,
  });
};

const getRecordById = async (req, res) => {
  const record = await Record.findById(req.params.id).populate(
    "createdBy",
    "name email role"
  );

  if (!record) {
    return res.status(404).json({ message: "Record not found" });
  }

  return res.status(200).json({ record });
};

const updateRecord = async (req, res) => {
  const record = await Record.findById(req.params.id);

  if (!record) {
    return res.status(404).json({ message: "Record not found" });
  }

  const fields = ["amount", "type", "category", "date", "notes"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      record[field] = req.body[field];
    }
  });

  await record.save();

  return res.status(200).json({ record });
};

const deleteRecord = async (req, res) => {
  const record = await Record.findById(req.params.id);

  if (!record) {
    return res.status(404).json({ message: "Record not found" });
  }

  await record.deleteOne();

  return res.status(200).json({ message: "Record deleted successfully" });
};

module.exports = {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
