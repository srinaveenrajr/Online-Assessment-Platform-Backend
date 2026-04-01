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

// ✅ STUDENT: GET ALL OWN RESULTS
router.get("/my-results", authMiddleware, controller.getMyResults);

// ✅ STUDENT: CHECK IF ATTEMPTED
router.get("/check-attempt/:examId", authMiddleware, controller.checkAttempt);

/* ===========================
   ADMIN
=========================== */
router.get(
  "/analytics/:examId",
  authMiddleware,
  adminMiddleware,
  controller.getDetailedAnalyticsByExam,
);

module.exports = router;
