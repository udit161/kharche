require("dotenv").config();

if (!process.env.MONGO_URI) {
  console.warn("WARNING: MONGO_URI not set in environment variables");
}
if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET not set in environment variables");
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/database");
const authRoutes = require("./auth/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

// Ensure DB connection for incoming serverless requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
  });
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;

