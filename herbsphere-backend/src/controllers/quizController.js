const Quiz = require("../models/Quiz");

/**
 * GET /quiz
 * Returns all quiz questions. Can be filtered by ?system= or ?plantId=.
 */
exports.getAllQuizzes = async (req, res) => {
  try {
    const { system, plantId } = req.query;
    const filter = {};

    if (system) {
      filter.system = system;
    }
    if (plantId) {
      filter.plantId = plantId;
    }

    const quizzes = await Quiz.find(filter);
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

