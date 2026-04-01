const Result = require("../models/Result");
const Exam = require("../models/Exam");

/* ===========================
   STUDENT: SUBMIT EXAM
=========================== */
const submitExam = async (req, res) => {
  try {
    const userId = req.user.id;
    const { examId, answers, startTime } = req.body;

    if (!examId || !answers) {
      return res.status(400).json({ message: "Invalid submission data" });
    }

    const exam = await Exam.findById(examId).populate("questions");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    let score = 0;
    exam.questions.forEach((q) => {
      const selectedIndex = answers[q._id.toString()];
      if (selectedIndex !== undefined) {
        const studentAnswer = String(q.options[Number(selectedIndex)] || "")
          .trim()
          .toLowerCase();
        const correctAnswer = String(q.correctAnswer || "")
          .trim()
          .toLowerCase();

        if (studentAnswer === correctAnswer && correctAnswer !== "") {
          score += 1;
        }
      }
    });

    const endTime = new Date();
    const start = startTime
      ? new Date(startTime)
      : new Date(Date.now() - 60000); // fallback to 1 min ago
    const timeTaken = Math.floor((endTime - start) / 1000); // in seconds

    const result = new Result({
      user: userId,
      exam: examId,
      score,
      totalQuestions: exam.questions.length,
      answers,
      startTime: start,
      endTime: endTime,
      timeTaken: timeTaken > 0 ? timeTaken : 0,
    });

    await result.save();

    res.status(201).json({
      message: "Submitted",
      score,
      totalQuestions: exam.questions.length,
      timeTaken,
    });
  } catch (err) {
    console.error("❌ SUBMIT ERROR:", err);
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

    // Calculate real rank
    const allResults = await Result.find({ exam: examId }).sort({
      score: -1,
      timeTaken: 1,
    });
    const rank =
      allResults.findIndex((r) => r.user.toString() === userId.toString()) + 1;

    res.json({
      examTitle: result.exam.title,
      score: result.score,
      totalQuestions: result.totalQuestions || 10,
      timeTaken: result.timeTaken || 0,
      submittedAt: result.createdAt,
      rank: rank > 0 ? rank : "N/A",
      totalParticipants: allResults.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch result" });
  }
};

/* ===========================
   STUDENT: GET ALL OWN RESULTS
=========================== */
const getMyResults = async (req, res) => {
  try {
    const userId = req.user.id;
    const results = await Result.find({ user: userId })
      .populate("exam", "title")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch results" });
  }
};

/* ===========================
   STUDENT: CHECK ATTEMPT
=========================== */
const checkAttempt = async (req, res) => {
  try {
    const userId = req.user.id;
    const { examId } = req.params;

    const result = await Result.findOne({ user: userId, exam: examId });
    res.json({ attempted: !!result });
  } catch (err) {
    res.status(500).json({ message: "Check failed" });
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
      .sort({ createdAt: -1 });

    if (!results || results.length === 0) {
      return res.json([]);
    }

    const formattedResults = results.map((r, index) => ({
      studentName: r.user?.name || `Student #${index + 1}`,
      email: r.user?.email || "N/A",
      score: r.score,
      totalQuestions: r.totalQuestions || 10,
      accuracy: Math.round((r.score / (r.totalQuestions || 10)) * 100),
      timeTaken: r.timeTaken || 0,
      submittedAt: r.createdAt,
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error("❌ ANALYTICS ERROR:", error);
    res.status(500).json({ message: "Analytics failed" });
  }
};

module.exports = {
  submitExam,
  getStudentResultByExam,
  getMyResults,
  checkAttempt,
  getDetailedAnalyticsByExam,
};
