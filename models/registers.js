const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// generating tokens
userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      //assigining token to the particular regisering user
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: token }); //putting token in schema
    await this.save(); // saving the token in the database
    return token; //returning value of token to the app.js page
  } catch (error) {
    res.send("The error part " + error);
    console.log("The error part " + error);
  }
};

// converting password to hash
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// now we need to create a schema

const User = new mongoose.model("User", userSchema);

module.exports = User;
