const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
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
    price: {
      type: Number,
      required: true,
    },
    cycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },
    nextBill: {
      type: String,
      default: "N/A",
    },
    color: {
      type: String,
      default: "#FF6B6B",
    },
    emoji: {
      type: String,
      default: "📱",
    },
    category: {
      type: String,
      default: "Custom",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
