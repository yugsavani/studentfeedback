require("dotenv").config(); //hide files
const express = require("express");
const bodyParser = require("body-parser");
const { body, validationResult, cookie } = require("express-validator");
const ejs = require("ejs");
require("./db/conn");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const auth = require("./src/middleware/auth");
const Feedback = require("./models/feedbacks");

const port = process.env.PORT || 3000;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const User = require("./models/registers");

app.get("/", function (req, res) {
  res.render("website");
});

app.get("/secret", auth, function (req, res) {
  // console.log(req.cookies.jwt);
  res.render("secret");
});

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.get("/teacher", function (req, res) {
  res.render("teacher");
});

app.post("/signup", async (req, res) => {
  try {
    const password = req.body.signuppassword;
    const cpassword = req.body.signupconfirmpassword;
    const q = req.body.signupemail;
    const w = q.split("@");
    if (w[1] !== "sitpune.edu.in") {
      return res.render("failure", { msg: "SIGNUP WITH PROPER CREDENTIALS" });
    }

    if (password === cpassword) {
      const registerUser = new User({
        fname: req.body.signupfname,
        lname: req.body.signuplname,
        email: req.body.signupemail,
        password: req.body.signuppassword,
      });
      // console.log("The success part is " + registerUser);

      const token = await registerUser.generateAuthToken();
      // console.log(token);

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 500000),
        httpOnly: true,
      });
      // console.log(cookie);

      const registered = await registerUser.save();
      res.status(201).render("website");
    } else {
      return res.render("failure", {
        msg: "PASSWORD AND COMFIRM PASSWORD NOT MATCHING",
      });
    }
  } catch (error) {
    res.status(400).send(error);
    console.log("The erroe part page");
  }
});

app.post("/login", async (req, res) => {
  try {
    const e = req.body.loginemail;
    const p = req.body.loginpassword;
    const useremail = await User.findOne({ email: e });

    const isMatch = await bcrypt.compare(p, useremail.password);

    const token = await useremail.generateAuthToken();
    // console.log(token);
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 500000),
      httpOnly: true,
    });

    if (isMatch) {
      res.status(201).redirect("/secret");
    } else {
      return res.render("failure", { msg: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(400).send("Invalid password details");
  }
});

app.get("/logout", auth, async (req, res) => {
  try {
    // console.log(req.user);
    res.clearCookie("jwt");
    // console.log("logged out successfully");
    // await req.user.save();
    res.redirect("/");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/submitfeedback", auth, async (req, res) => {
  let q1 = req.body.q1;
  let q2 = req.body.q2;
  let q3 = req.body.q3;
  let q4 = req.body.q4;
  let q5 = req.body.q5;
  let tname = req.body.tname;
  let comment = req.body.comment;
  try {
    const f = new Feedback({
      question1: q1,
      question2: q2,
      question3: q3,
      question4: q4,
      question5: q5,
      teachername: tname,
      comment: comment,
    });

    await f.save();

    res.redirect("/secret");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000, function () {
  console.log("server running on port 3000");
});
