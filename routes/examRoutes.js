const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const examController = require("../controllers/examController");

/* ADMIN */
router.post("/", authMiddleware, adminMiddleware, examController.createExam);

/* STUDENT */
router.get("/", authMiddleware, examController.getAllExams);
router.get("/:id", authMiddleware, examController.getExamById);

module.exports = router;
