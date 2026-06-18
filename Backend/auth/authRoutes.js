const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  registerUser,
  LoginUser,
  getMe,
} = require("../controllers/authControllers");

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/me", protect, getMe);

module.exports = router;
