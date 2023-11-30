const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz.js");

// Analytics tab api
router.get("/quizzes", async (req, res) => {
  try {
    const { email } = req.query;
    const quizzes = await Quiz.find({ email });
    res.json(quizzes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

//for quizData in dashboard Screen
router.get("/userData", async (req, res) => {
  const { email } = req.query;

  try {
    // Find all quizzes created by the user
    const quizzes = await Quiz.find({ email: email });

    // Calculate total quizzes, questions, and impressions
    const totalQuizzes = quizzes.length;
    const totalQuestions = quizzes.reduce((sum, quiz) => {
      return (
        sum +
        quiz.questions.reduce((questionSum, questionSet) => {
          return questionSum + Object.keys(questionSet.pollQuestion).length;
        }, 0)
      );
    }, 0);
    const totalImpressions = quizzes.reduce(
      (sum, quiz) => sum + quiz.impressions,
      0
    );

    res.json({
      quizzes: totalQuizzes,
      questions: totalQuestions,
      impressions: totalImpressions,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user data" });
  }
});

router.get("/trendingQuizzes", async (req, res) => {
  const { email } = req.query;

  try {
    // Find top 6 quizzes created by the user, sorted by impressions in descending order
    const quizzes = await Quiz.find({ email: email })
      .sort({ impressions: -1 })
      .limit(6)
      .select("quizName impressions date");

    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching trending quizzes:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching trending quizzes" });
  }
});

module.exports = router;
