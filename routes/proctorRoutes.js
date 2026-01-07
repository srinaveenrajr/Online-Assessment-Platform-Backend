const express = require("express");
const ProctorLog = require("../models/ProctorLog");

const router = express.Router();

/**
 * SAVE PROCTOR VIOLATION
 */
router.post("/log", async (req, res) => {
  try {
    const { studentId, examId, type, message } = req.body;

    const log = await ProctorLog.create({
      student: studentId,
      exam: examId,
      type,
      message,
    });

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ADMIN – GET ALL LOGS
 */
router.get("/", async (req, res) => {
  try {
    const logs = await ProctorLog.find()
      .populate("student", "name email")
      .populate("exam", "title");

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
