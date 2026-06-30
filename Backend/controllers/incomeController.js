const Income = require("../models/income");

exports.addIncome = async (req, res) => {
  try {
    const { source, amount, date, icon } = req.body;
    
    if (!source || !amount) {
      return res.status(400).json({ message: "Source and amount are required" });
    }

    const income = await Income.create({
      user: req.user.id,
      source,
      amount,
      date,
      icon
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
