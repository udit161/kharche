const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { addIncome, getIncomes } = require("../controllers/incomeController");

router.post("/", authMiddleware.protect, addIncome);
router.get("/", authMiddleware.protect, getIncomes);

module.exports = router;
