const Exam = require("../models/Exam");
const QuestionBank = require("../models/QuestionBank");

/* =========================================
   ADMIN: CREATE EXAM
========================================= */
exports.createExam = async (req, res) => {
  try {
    const { title, startTime, endTime, questionBankId } = req.body;

    if (!title || !startTime || !endTime || !questionBankId) {
      return res.status(400).json({
        message: "Title, time, and question bank are required",
      });
    }

    // 1️⃣ Get selected Question Bank
    const questionBank = await QuestionBank.findById(questionBankId);

    if (!questionBank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    if (!questionBank.questions || questionBank.questions.length === 0) {
      return res
        .status(400)
        .json({ message: "Question bank has no questions" });
    }

    // 2️⃣ Create exam using ONLY selected questions
    const exam = await Exam.create({
      title,
      startTime,
      endTime,
      questions: questionBank.questions,
    });

    res.status(201).json(exam);
  } catch (err) {
    console.error("Create exam error:", err);
    res.status(500).json({ message: "Failed to create exam" });
  }
};

/* =========================================
   STUDENT: GET ALL EXAMS  ✅ (FIX)
========================================= */
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .select("title startTime endTime createdAt")
      .sort({ createdAt: -1 });

    res.json(exams);
  } catch (err) {
    console.error("Get all exams error:", err);
    res.status(500).json({ message: "Failed to fetch exams" });
  }
};

/* =========================================
   STUDENT: GET EXAM BY ID
========================================= */
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("questions");

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(exam);
  } catch (err) {
    console.error("Get exam error:", err);
    res.status(500).json({ message: "Failed to load exam" });
  }
};
