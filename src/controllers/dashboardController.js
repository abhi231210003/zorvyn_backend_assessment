const { Record } = require("../models/Record");

const getSummary = async (req, res) => {
  const [totals] = await Record.aggregate([
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        totalExpense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
      },
    },
  ]);

  const safeTotals = totals || { totalIncome: 0, totalExpense: 0 };

  const categoryWiseTotals = await Record.aggregate([
    {
      $group: {
        _id: "$category",
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        income: 1,
        expense: 1,
        total: 1,
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);

  const monthlyTrend = await Record.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        amount: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  const recentActivity = await Record.find()
    .populate("createdBy", "name email role")
    .sort({ date: -1, createdAt: -1 })
    .limit(5);

  return res.status(200).json({
    totalIncome: safeTotals.totalIncome,
    totalExpenses: safeTotals.totalExpense,
    netBalance: safeTotals.totalIncome - safeTotals.totalExpense,
    categoryWiseTotals,
    monthlyTrend,
    recentActivity,
  });
};

module.exports = {
  getSummary,
};
