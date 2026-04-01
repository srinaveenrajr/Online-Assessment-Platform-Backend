const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      default: 10,
    },
    timeTaken: {
      type: Number, // in seconds
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    answers: {
      type: Object, // Stores questionId: selectedOptionIndex
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
