const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
  },

  // ✅ REQUIRED FOR FILTERING
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
});

module.exports = mongoose.model("Question", questionSchema);
