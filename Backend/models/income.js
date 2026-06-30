const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String, // E.g., 'Today', 'Yesterday', or ISO date string
      default: "Today",
    },
    icon: {
      type: String, // Emoji icon
      default: "💰",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
