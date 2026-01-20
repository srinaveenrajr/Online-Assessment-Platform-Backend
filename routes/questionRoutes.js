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

/**
 * UPDATE QUESTION
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(updatedQuestion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * DELETE QUESTION
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
