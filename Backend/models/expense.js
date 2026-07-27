const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    date: {
      type: String,
      default: "Today",
    },
    icon: {
      type: String,
      default: "💸",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low", "none"],
      default: "none",
    },
    due: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
