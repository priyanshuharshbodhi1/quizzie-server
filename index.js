const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const path = require("path");
const PORT = process.env.PORT || 3100;
dotenv.config();

const app = express();

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(cookieParser());

app.use(
  cors({
    origin: `${process.env.REACT_URL}`,
    credentials: true,
  })
);

//models
const User = require("./models/user.js");
const Quiz = require("./models/quiz.js");

// APIs------------------------------------------

//health api
app.get("/health", (req, res) => {
  res.json({ message: "All good!" });
});

app.get("/", (req, res) => {
  res.json({ message: "All good!" });
});

//signup api
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await User.findOne({ email });
    if (user) {
      return res.json({ message: "User already exists" });
    } else {
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      // Generate JWT
      const jwToken = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Assign JWT to Cookie
      res.cookie("jwt", jwToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });

      // Redirect to the desired URL
      return res.redirect(302, `${process.env.REACT_URL}/dashboard`);
    }
  } catch (error) {
    // console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

//login api
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const passwordMatched = await bcrypt.compare(password, user.password);
      if (passwordMatched) {
        const jwToken = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.cookie("jwt", jwToken, { httpOnly: true });
        res.redirect(302, `${process.env.REACT_URL}/dashboard`);
        return;
      } else {
        res.json({
          status: "FAIL",
          message: "Incorrect password",
        });
      }
    } else {
      res.json({
        status: "FAIL",
        message: "User does not exist",
      });
    }
  } catch (error) {
    // console.log(error);
    res.json({
      status: "FAIL",
      message: "Something went wrong",
      error,
    });
  }
})

//Create Quiz API
app.post("/api/createquiz", async (req, res) => {
  try {
    console.log(req.body);
    const { quizName, quizType, questions  } = req.body;   //, quizType, questions 
    const newQuiz = new Quiz({
      quizName,
      quizType,
      questions,
    });
    await newQuiz.save();
    console.log("creating quiz")
    console.log("created new quiz")
    res.json({ message: "Quiz created successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});


app.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`Server running on http://localhost:${PORT}`))
    .catch((error) => console.error(error));
});
