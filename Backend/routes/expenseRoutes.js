const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { addExpense, getExpenses } = require("../controllers/expenseController");

router.post("/", authMiddleware, addExpense);
router.get("/", authMiddleware, getExpenses);

module.exports = router;
