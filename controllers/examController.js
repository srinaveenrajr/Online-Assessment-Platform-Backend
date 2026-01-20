const Exam = require("../models/Exam");
const QuestionBank = require("../models/QuestionBank");

/* ADMIN: CREATE EXAM */
exports.createExam = async (req, res) => {
  try {
    const { title, startTime, endTime, questionBankId } = req.body;

    if (!title || !startTime || !endTime || !questionBankId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const questionBank = await QuestionBank.findById(questionBankId);
    if (!questionBank || questionBank.questions.length === 0) {
      return res.status(400).json({ message: "Invalid question bank" });
    }

    const exam = await Exam.create({
      title,
      startTime,
      endTime,
      questions: questionBank.questions,
    });

    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: "Failed to create exam" });
  }
};

/* ADMIN: UPDATE EXAM */
exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    Object.assign(exam, req.body);
    await exam.save();

    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

/* ADMIN: DELETE EXAM */
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    await exam.deleteOne();
    res.json({ message: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

/* STUDENT: GET ALL EXAMS */
exports.getAllExams = async (req, res) => {
  const exams = await Exam.find()
    .select("title startTime endTime createdAt")
    .sort({ createdAt: -1 });

  res.json(exams);
};

/* STUDENT: GET EXAM BY ID */
exports.getExamById = async (req, res) => {
  const exam = await Exam.findById(req.params.id).populate("questions");
  if (!exam) return res.status(404).json({ message: "Exam not found" });
  res.json(exam);
};
