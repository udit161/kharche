const jwt = require("jsonwebtoken");
const User = require("../models/user");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({
    email,
  });
};

exports.LoginUser = async (req, res) => {};

exports.getMe = async (req, res) => {};
