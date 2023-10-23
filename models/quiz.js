const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  optionType: { type: String, required: true },
  options: {
    option1: { type: optionSchema},
    option2: { type: optionSchema},
    option3: { type: optionSchema},
    option4: { type: optionSchema},
  },
  timerType: { type: Number},
});

const quizSchema = new mongoose.Schema({
  quizName: { type: String, required: true },
  quizType: { type: String, required: true },
  questions: [questionSchema],
});

module.exports = mongoose.model("Quiz", quizSchema);
