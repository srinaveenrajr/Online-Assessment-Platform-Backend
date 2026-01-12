const express = require("express");
const {
  createQuestionBank,
  getAllQuestionBanks,
  getQuestionBankById,
} = require("../controllers/questionBankController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createQuestionBank);
router.get("/", authMiddleware, getAllQuestionBanks);
router.get("/:id", authMiddleware, getQuestionBankById);

module.exports = router;
