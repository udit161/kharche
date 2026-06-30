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
      type: String, // E.g., 'Today', 'Yesterday', or ISO date string
      default: "Today",
    },
    icon: {
      type: String, // Emoji icon
      default: "💸",
    },
    priority: {
      type: String, // 'high', 'medium', 'low', or 'none' (for recent expenses)
      enum: ["high", "medium", "low", "none"],
      default: "none",
    },
    due: {
      type: String, // Due date for priority expenses
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
