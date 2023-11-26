const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz.js");

// Add your quiz routes here (createquiz, quiz/:quizId/impression, quiz/:quizId/submit)

//Create Quiz API
router.post("/createquiz", async (req, res) => {
  try {
    const { email, quizName, quizType, questions } = req.body;
    const newQuiz = new Quiz({
      email,
      quizName,
      quizType,
      questions,
      date: new Date(),
    });
    // console.log(questions[0].options[0])
    // console.log(questions[0])
    // console.log(questions)
    // console.dir(questions, { depth: null });

    await newQuiz.save();
    res.json({ message: "Quiz created successfully", id: newQuiz._id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

// //for impressions ++
// router.post("/api/quiz/:quizId/impression", async (req, res) => {
//   try {
//     const quiz = await Quiz.findById(req.params.quizId);
//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }
//     quiz.impressions = quiz.impressions + 1;
//     await quiz.save();
//     res.json({ message: "Impression recorded" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.delete("/:quizId", async (req, res) => {
    try {
      const quizId = req.params.quizId;
      const quiz = await Quiz.findByIdAndDelete(quizId);
  
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
  
      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred", error: error.message });
    }
  });

module.exports = router;
