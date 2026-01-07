const express = require("express");
const Result = require("../models/Result");

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const results = await Result.find();

    const totalAttempts = results.length;
    const averageScore =
      results.reduce((sum, r) => sum + r.score, 0) / (totalAttempts || 1);

    res.json({
      totalAttempts,
      averageScore: Number(averageScore.toFixed(2)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; // ✅ THIS LINE IS CRITICAL
