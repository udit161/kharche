const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { addIncome, getIncomes } = require("../controllers/incomeController");

router.post("/", authMiddleware, addIncome);
router.get("/", authMiddleware, getIncomes);

module.exports = router;
