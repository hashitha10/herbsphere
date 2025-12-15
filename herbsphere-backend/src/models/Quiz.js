const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: (v) => Array.isArray(v) && v.length >= 2,
    },
    answer: {
      type: String,
      required: true,
    },
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
    },
    system: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);

