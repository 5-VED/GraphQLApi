const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      default: null,
    },
    members: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
          ref:"users",
          required: true,
        },
        isAdmin: {
          type: Boolean,
          required: true,
          default: false,
        },
        date: {
          type: Date,
          default: new Date().toLocaleDateString(),
          required: true,
        },
      },
    ],
    isDelete:{
      type : Boolean,
      default:false,
      required:true
    }
  },
  { timestamps: true }
);

const Rooms = new mongoose.model("rooms", schema);
module.exports = Rooms;
