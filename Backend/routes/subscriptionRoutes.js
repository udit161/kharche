const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { addSub, getSubs, deleteSub } = require("../controllers/subscriptionController");

router.post("/", authMiddleware.protect, addSub);
router.get("/", authMiddleware.protect, getSubs);
router.delete("/:id", authMiddleware.protect, deleteSub);

module.exports = router;
