const express = require("express");
const router = express.Router();
const
const {
  registerUser,
  LoginUser,
  getMe,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/me", getMe);

module.exports = router;
