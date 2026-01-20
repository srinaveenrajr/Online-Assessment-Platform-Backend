const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const examController = require("../controllers/examController");

/* ================= ADMIN ================= */

// Create exam
router.post("/", authMiddleware, adminMiddleware, examController.createExam);

// ✅ UPDATE exam (ADMIN)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updatedExam = await examController.updateExam(req, res);
    return updatedExam;
  } catch (error) {
    res.status(500).json({ message: "Failed to update exam" });
  }
});

// ✅ DELETE exam (ADMIN)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedExam = await examController.deleteExam(req, res);
    return deletedExam;
  } catch (error) {
    res.status(500).json({ message: "Failed to delete exam" });
  }
});

/* ================= STUDENT ================= */

// Get all exams
router.get("/", authMiddleware, examController.getAllExams);

// Get exam by ID
router.get("/:id", authMiddleware, examController.getExamById);

module.exports = router;
