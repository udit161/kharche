const Subscription = require("../models/subscription");

exports.addSub = async (req, res) => {
  try {
    const { name, price, cycle, nextBill, color, emoji, category } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const sub = await Subscription.create({
      user: req.user.id,
      name,
      price,
      cycle,
      nextBill,
      color,
      emoji,
      category
    });

    res.status(201).json(sub);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getSubs = async (req, res) => {
  try {
    const subs = await Subscription.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(subs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteSub = async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (sub.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await sub.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
