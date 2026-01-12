const Exam = require("../models/Exam");
const Question = require("../models/Question");

/**
 * ADMIN: CREATE EXAM
 */
exports.createExam = async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔹 STEP 1: get all questions
    const questions = await Question.find({}, "_id");

    // 🔹 STEP 2: extract only IDs
    const questionIds = questions.map((q) => q._id);

    // 🔹 STEP 3: create exam with questions
    const exam = new Exam({
      title,
      startTime,
      endTime,
      questions: questionIds,
    });

    await exam.save();

    res.status(201).json(exam);
  } catch (err) {
    console.error("Create exam error:", err);
    res.status(500).json({ message: "Failed to create exam" });
  }
};

/**
 * STUDENT: GET ALL EXAMS
 */
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ startTime: 1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch exams" });
  }
};

/**
 * STUDENT: GET SINGLE EXAM WITH QUESTIONS
 */
exports.getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id).populate({
      path: "questions",
      select: "questionText options",
    });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(exam);
  } catch (err) {
    console.error("Get exam error:", err);
    res.status(500).json({ message: "Failed to load exam" });
  }
};
