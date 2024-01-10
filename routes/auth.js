const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const isAuthenticated = require("../middlewares/isAuthenticated");
const generateToken = require('../utils/generateToken');

//signup api
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!password) {
      return res
        .status(400)
        .json({ status: "FAIL", message: "Password is required" });
    }
    if (!name) {
      return res
        .status(400)
        .json({ status: "FAIL", message: "Username is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await User.findOne({ email });
    if (user) {
      return res.json({
        status: "FAIL",
        message: "User already exists for the Email Id.",
      });
    } else {
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      // Generate JWT
      const jwToken = generateToken(newUser);

      return res.json({ token: jwToken });

      // Redirect to the desired URL
      // return res.redirect(302, `${process.env.REACT_URL}/dashboard`);
    }
  } catch (error) {
    // console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

//login api
router.post("/login", async (req, res) => {
  try {
    // console.log('started')
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const passwordMatched = await bcrypt.compare(password, user.password);
      
      if (passwordMatched) {
        
        const jwToken = generateToken(user);
        // console.log("Ended ",jwToken[0])
        
        return res.json({ token: jwToken });
      } else {
        res.json({
          status: "FAIL",
          message: "Incorrect password",
        });
      }
    } else {
      res.json({
        status: "FAIL",
        message: "User does not exist for this Email Id",
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
});

//logout api
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

//isloggedin api
router.get("/isloggedin", isAuthenticated, (req, res) => {
  // Check if the user is logged in and include the user's email in the response
  if (req.user) {
    res.json({
      isLoggedIn: true,
      user: { email: req.user.email },
    });
  } else {
    res.json({ isLoggedIn: false });
  }
});

module.exports = router;
