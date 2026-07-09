const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  registerUser,
  LoginUser,
  getMe,
  logoutUser,
  updateBudget,
} = require("../controllers/authControllers");

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/me", protect, getMe);
router.put("/budget", protect, updateBudget);
router.post("/logout", logoutUser);

module.exports = router;
