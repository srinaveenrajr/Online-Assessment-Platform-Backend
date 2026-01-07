const express = require("express");
const Question = require("../models/Question");

const router = express.Router();

/**
 * CREATE QUESTION
 */
router.post("/", async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET ALL QUESTIONS
 */
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
