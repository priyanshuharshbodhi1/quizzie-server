const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz');

// Route to display a quiz based on a parameter
router.get("/:quizId", async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
    // console.log(quiz);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

router.delete("/:quizId", async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findByIdAndDelete(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

module.exports = router;
