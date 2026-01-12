const mongoose = require("mongoose");

const proctorLogSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    type: {
      type: String,
      required: true, // TAB_SWITCH, FULLSCREEN_EXIT, WEBCAM_STOP, BLUR
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProctorLog", proctorLogSchema);
