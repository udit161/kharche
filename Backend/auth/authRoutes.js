const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  registerUser,
  LoginUser,
  getMe,
  logoutUser,
  googleAuth,
  googleClientId,
  updateBudget,
} = require("../controllers/authControllers");

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.post("/google", googleAuth);
router.get("/google-client-id", googleClientId);
router.get("/me", protect, getMe);
router.put("/budget", protect, updateBudget);
router.post("/logout", logoutUser);

module.exports = router;
