const Exam = require("../models/Exam");
const Question = require("../models/Question");
const Result = require("../models/Result");

exports.submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;

    const exam = await Exam.findById(examId).populate("questions");

    let score = 0;

    exam.questions.forEach((q) => {
      const userAnswer = answers.find((a) => a.questionId === q._id.toString());

      if (userAnswer && userAnswer.selectedAnswer === q.correctAnswer) {
        score += 1;
      }
    });

    const result = await Result.create({
      exam: examId,
      answers,
      score,
    });

    res.json({
      message: "Exam submitted successfully",
      score,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
