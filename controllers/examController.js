const Exam = require("../models/Exam");

// CREATE EXAM
exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL EXAMS
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate("questions");
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET EXAM BY ID (THIS WAS MISSING OR WRONG)
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("questions");

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
