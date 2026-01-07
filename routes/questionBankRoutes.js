const express = require("express");
const QuestionBank = require("../models/QuestionBank");

const router = express.Router();

/**
 * CREATE QUESTION BANK
 */
router.post("/", async (req, res) => {
  try {
    const bank = await QuestionBank.create(req.body);
    res.status(201).json(bank);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET ALL QUESTION BANKS
 */
router.get("/", async (req, res) => {
  try {
    const banks = await QuestionBank.find().populate("questions");
    res.json(banks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
