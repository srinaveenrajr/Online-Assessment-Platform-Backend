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

    res.status(201).json({ message: "Submitted", score });
  } catch (err) {
    res.status(500).json({ message: "Submit failed" });
  }
};

/* ===========================
   STUDENT: GET RESULT BY EXAM
=========================== */
const getStudentResultByExam = async (req, res) => {
  try {
    const userId = req.user.id;
    const { examId } = req.params;

    const result = await Result.findOne({
      user: userId,
      exam: examId,
    })
      .populate("exam", "title")
      .sort({ createdAt: -1 });

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json({
      examTitle: result.exam.title,
      score: result.score,
      submittedAt: result.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch result" });
  }
};

/* ===========================
   ADMIN: ANALYTICS
=========================== */
const getDetailedAnalyticsByExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const results = await Result.find({ exam: examId })
      .populate("user", "name email")
      .populate("exam", "title")
      .sort({ createdAt: 1 });

    const map = {};

    results.forEach((r) => {
      const uid = r.user._id.toString();
      if (!map[uid]) {
        map[uid] = {
          username: r.user.name || r.user.email,
          examTitle: r.exam.title,
          attempts: 0,
          latestScore: r.score,
        };
      }
      map[uid].attempts += 1;
      map[uid].latestScore = r.score;
    });

    res.json(Object.values(map));
  } catch {
    res.status(500).json({ message: "Analytics failed" });
  }
};

module.exports = {
  submitExam,
  getStudentResultByExam,
  getDetailedAnalyticsByExam,
};
