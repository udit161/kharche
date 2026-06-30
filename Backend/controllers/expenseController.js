const Expense = require("../models/expense");

exports.addExpense = async (req, res) => {
  try {
    const { name, amount, category, date, icon, priority, due } = req.body;
    
    if (!name || !amount) {
      return res.status(400).json({ message: "Name and amount are required" });
    }

    const expense = await Expense.create({
      user: req.user.id,
      name,
      amount,
      category,
      date,
      icon,
      priority,
      due
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
