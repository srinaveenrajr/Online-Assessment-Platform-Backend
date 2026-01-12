const QuestionBank = require("../models/QuestionBank");

// CREATE QUESTION BANK
const createQuestionBank = async (req, res) => {
  try {
    const { name, description, questions } = req.body;

    if (!name || !questions || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "Name and questions are required" });
    }

    const qb = new QuestionBank({
      name,
      description,
      questions,
    });

    await qb.save();
    res.status(201).json(qb);
  } catch (err) {
    console.error("Create QuestionBank Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL QUESTION BANKS
const getAllQuestionBanks = async (req, res) => {
  try {
    const banks = await QuestionBank.find().populate("questions");
    res.json(banks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET QUESTION BANK BY ID
const getQuestionBankById = async (req, res) => {
  try {
    const qb = await QuestionBank.findById(req.params.id).populate("questions");
    if (!qb) {
      return res.status(404).json({ message: "Question bank not found" });
    }
    res.json(qb);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createQuestionBank,
  getAllQuestionBanks,
  getQuestionBankById,
};
