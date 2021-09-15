const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    created_At: {
      type: String,
      default: Date.now().toString(),
      expires: 3600,
    },
  },
  { timestamps: true }
);

const Token = new mongoose.model("tokens", tokenSchema);
module.exports = Token;
