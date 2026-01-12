const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/* 🔥 DEBUG IMPORT */
const controller = require("../controllers/resultController");

console.log("RESULT CONTROLLER:", controller);

/* ===========================
   ROUTES
=========================== */
router.post("/submit", authMiddleware, controller.submitExam);

router.get(
  "/analytics/:examId",
  authMiddleware,
  adminMiddleware,
  controller.getDetailedAnalyticsByExam
);

module.exports = router;
