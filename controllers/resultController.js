const Result = require("../models/Result");
const Exam = require("../models/Exam");

/* ===========================
   STUDENT: SUBMIT EXAM
=========================== */
const submitExam = async (req, res) => {
  try {
    const userId = req.user.id;
    const { examId, answers } = req.body;

    if (!examId || !answers) {
      return res.status(400).json({ message: "Invalid submission data" });
    }

    const exam = await Exam.findById(examId).populate("questions");

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    let score = 0;

    exam.questions.forEach((q) => {
      if (answers[q._id] === q.correctAnswer) {
        score += 1;
      }
    });

    const result = new Result({
      user: userId,
      exam: examId,
      score,
      answers,
    });

    await result.save();

    res.status(201).json({
      message: "Exam submitted successfully",
      score,
    });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ message: "Submit failed" });
  }
};

/* ===========================
   ADMIN: ANALYTICS (FIXED)
=========================== */
const getDetailedAnalyticsByExam = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!examId) {
      return res.status(400).json({ message: "Exam ID missing" });
    }

    const results = await Result.find({ exam: examId })
      .populate("user", "name email")
      .populate("exam", "title")
      .sort({ createdAt: 1 });

    const analyticsMap = {};

    results.forEach((r) => {
      const userId = r.user._id.toString();

      if (!analyticsMap[userId]) {
        analyticsMap[userId] = {
          username: r.user.name || r.user.email,
          examTitle: r.exam.title,
          attempts: 0,
          latestScore: r.score,
        };
      }

      analyticsMap[userId].attempts += 1;
      analyticsMap[userId].latestScore = r.score;
    });

    res.json(Object.values(analyticsMap));
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Analytics failed" });
  }
};

module.exports = {
  submitExam,
  getDetailedAnalyticsByExam,
};
