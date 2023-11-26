const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require('./config/db'); 
const PORT = process.env.PORT || 3100;
dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.use(
  cors({
    origin: `${process.env.REACT_URL}`,
    credentials: true,
  })
);

// APIs------------------------------------------

//health api
app.get("/health", (req, res) => {
  res.json({ message: "All good!" });
});

//Routes
const authRoutes = require("./routes/auth");
const analyticsRoutes = require("./routes/analytics");
const quizQuestions = require("./routes/quizQuestions");
const quiz = require("./routes/quiz");

app.use("/api", authRoutes);
app.use("/api", analyticsRoutes);
app.use("/api/quiz", quizQuestions);
app.use("/api", quiz);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});