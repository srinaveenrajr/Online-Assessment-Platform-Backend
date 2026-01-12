const express = require("express");
const ProctorLog = require("../models/ProctorLog");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * SAVE PROCTOR VIOLATION (STUDENT)
 */
router.post("/log", authMiddleware, async (req, res) => {
  try {
    const { examId, type, message } = req.body;

    const log = await ProctorLog.create({
      student: req.user.id, // 🔥 TRUST BACKEND ONLY
      exam: examId,
      type,
      message,
    });

    res.status(201).json(log);
  } catch (err) {
    console.error("PROCTOR LOG ERROR:", err);
    res.status(500).json({ message: "Failed to log violation" });
  }
});

/**
 * ADMIN – GET ALL LOGS
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const logs = await ProctorLog.find()
      .sort({ createdAt: -1 }) // 🔥 latest first
      .populate("student", "name email")
      .populate("exam", "title");

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

module.exports = router;
