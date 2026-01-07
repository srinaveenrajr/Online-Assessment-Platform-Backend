const express = require("express");
const Exam = require("../models/Exam");

const router = express.Router();

/**
 * CREATE EXAM (ADMIN)
 */
router.post("/", async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * START EXAM (STUDENT)
 */
router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id/start", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate({
      path: "questionBank",
      populate: { path: "questions" },
    });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const now = new Date();

    if (now < exam.startTime || now > exam.endTime) {
      return res.status(403).json({ message: "Exam not active" });
    }

    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
