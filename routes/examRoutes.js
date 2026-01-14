const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const examController = require("../controllers/examController");

/* ================= ADMIN ================= */

// Create exam
router.post("/", authMiddleware, adminMiddleware, examController.createExam);

/* ================= STUDENT ================= */

// Get all exams
router.get("/", authMiddleware, examController.getAllExams);

// Get exam by ID
router.get("/:id", authMiddleware, examController.getExamById);

module.exports = router;
