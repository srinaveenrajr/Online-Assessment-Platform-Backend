const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===============================
   MIDDLEWARES
================================ */
app.use(cors());
app.use(express.json());

/* ===============================
   ROUTES (COMMONJS ONLY)
================================ */
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const questionBankRoutes = require("./routes/questionBankRoutes");
const examRoutes = require("./routes/examRoutes");
const resultRoutes = require("./routes/resultRoutes");
const proctorRoutes = require("./routes/proctorRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

/* ===============================
   ROUTE REGISTRATION
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/question-banks", questionBankRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/proctor", proctorRoutes);
app.use("/api/analytics", analyticsRoutes);

/* ===============================
   ROOT CHECK
================================ */
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

/* ===============================
   DATABASE CONNECTION
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
