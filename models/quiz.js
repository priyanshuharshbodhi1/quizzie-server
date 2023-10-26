const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: { type: String },
  imageURL: { type: String },
});

const questionSchema = new mongoose.Schema({
  pollQuestion: { type: Object, required: true },
  ansOption: { type: Object, required: true },
  options: [optionSchema],
  timerType: { type: Object, required: true },
});

const quizSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: Date, default: Date.now },
  quizName: { type: String, required: true },
  quizType: { type: String, required: true },
  questions: [questionSchema],
});

module.exports = mongoose.model("Quiz", quizSchema);
