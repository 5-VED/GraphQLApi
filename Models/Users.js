const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  bio: {
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
  date: {
    type: Date,
    required: true,
  },
});

const User = new mongoose.model("users", userSchema);
module.exports = User;
