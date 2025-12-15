const express = require("express");
const router = express.Router();
const { getAllQuizzes } = require("../controllers/quizController");

// GET /quiz
router.get("/", getAllQuizzes);

module.exports = router;

