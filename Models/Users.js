const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  bio:{
    type: String,
    required: false,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    default: null,
  },
  resetToken: {
    type: String,
    trim: true,
    required: false,
    default: null,
  },
  date: {
    type: String,
    default: new Date().toLocaleDateString(),
    required: true,
  },
});

const User = new mongoose.model("users", userSchema);
module.exports = User;
