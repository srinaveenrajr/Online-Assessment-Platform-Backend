const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const controller = require("../controllers/resultController");

/* ===========================
   STUDENT
=========================== */
router.post("/submit", authMiddleware, controller.submitExam);

// ✅ STUDENT: GET OWN RESULT FOR AN EXAM
router.get("/exam/:examId", authMiddleware, controller.getStudentResultByExam);

/* ===========================
   ADMIN
=========================== */
router.get(
  "/analytics/:examId",
  authMiddleware,
  adminMiddleware,
  controller.getDetailedAnalyticsByExam
);

module.exports = router;
