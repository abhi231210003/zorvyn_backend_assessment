const connectDB = require("../config/db");
const { User } = require("../models/User");
const { Record } = require("../models/Record");

const usersSeed = [
  {
    name: "Admin User",
    email: "admin@zorvyn.com",
    password: "Admin@123",
    role: "admin",
    status: "active",
  },
  {
    name: "Analyst User",
    email: "analyst@zorvyn.com",
    password: "Analyst@123",
    role: "analyst",
    status: "active",
  },
  {
    name: "Viewer User",
    email: "viewer@zorvyn.com",
    password: "Viewer@123",
    role: "viewer",
    status: "active",
  },
  {
    name: "Inactive Viewer",
    email: "inactive@zorvyn.com",
    password: "Inactive@123",
    role: "viewer",
    status: "inactive",
  },
];

const baseDate = new Date("2026-01-01T00:00:00.000Z");

const recordRows = [
  [5200, "income", "Salary", 5, "January salary"],
  [750, "expense", "Rent", 6, "Monthly rent"],
  [180, "expense", "Utilities", 7, "Electricity and water"],
  [125, "expense", "Internet", 8, "Broadband bill"],
  [300, "expense", "Groceries", 10, "Weekly groceries"],
  [600, "income", "Freelance", 12, "Mobile app consulting"],
  [95, "expense", "Transportation", 13, "Metro recharge"],
  [220, "expense", "Dining", 14, "Team dinner"],
  [5200, "income", "Salary", 36, "February salary"],
  [820, "expense", "Rent", 37, "Monthly rent"],
  [340, "expense", "Insurance", 38, "Health insurance"],
  [1400, "income", "Bonus", 40, "Quarterly performance bonus"],
  [410, "expense", "Shopping", 43, "Office chair"],
  [5200, "income", "Salary", 65, "March salary"],
  [250, "expense", "Entertainment", 66, "Concert tickets"],
];

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([User.deleteMany({}), Record.deleteMany({})]);

    const createdUsers = [];
    for (const userPayload of usersSeed) {
      const user = new User(userPayload);
      await user.save();
      createdUsers.push(user);
    }

    const adminUser = createdUsers.find((user) => user.role === "admin");

    const recordsToInsert = recordRows.map(
      ([amount, type, category, dayOffset, notes]) => ({
        amount,
        type,
        category,
        date: new Date(baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000),
        notes,
        createdBy: adminUser._id,
      })
    );

    await Record.insertMany(recordsToInsert);

    console.log("Seed completed successfully");
    console.log("\nDemo login credentials:");
    console.log("Admin   -> admin@zorvyn.com / Admin@123");
    console.log("Analyst -> analyst@zorvyn.com / Analyst@123");
    console.log("Viewer  -> viewer@zorvyn.com / Viewer@123");
    console.log("Inactive (blocked) -> inactive@zorvyn.com / Inactive@123");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed", error);
    process.exit(1);
  }
};

seed();
