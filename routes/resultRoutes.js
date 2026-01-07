const express = require("express");
const Result = require("../models/Result");
const Question = require("../models/Question");

const router = express.Router();

/**
 * SUBMIT EXAM + AUTO GRADING
 */
router.post("/submit", async (req, res) => {
  try {
    const { examId, studentId, answers } = req.body;

    let score = 0;

    for (const ans of answers) {
      const question = await Question.findById(ans.questionId);
      if (question && question.correctAnswer === ans.selectedAnswer) {
        score++;
      }
    }

    const result = await Result.create({
      student: studentId,
      exam: examId,
      score,
      answers,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
