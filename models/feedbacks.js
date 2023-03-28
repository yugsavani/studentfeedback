const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Radio } = require("@mui/material");

const feedbackSchema = new mongoose.Schema({
  teachername: {
    type: String,
  },
  question1: {
    type: String,
    required: true,
  },
  question2: {
    type: String,
    required: true,
  },
  question3: {
    type: String,
    required: true,
  },
  question4: {
    type: String,
    required: true,
  },
  question5: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
});

const Feedback = new mongoose.model("Feedback", feedbackSchema);
Feedback.createIndexes();
module.exports = Feedback;
