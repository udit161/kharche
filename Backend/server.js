require("dotenv").config();

if (!process.env.MONGO_URI) {
  console.error("ERROR: MONGO_URI not set in .env file");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET not set in .env file");
  process.exit(1);
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
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.use(express.static(path.join(__dirname, "../Frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
