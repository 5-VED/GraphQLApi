const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: false,
    },
    receiver_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: false,
    },
    group_id: {
      type: mongoose.Types.ObjectId,
      ref: "rooms",
      default:null,
      required: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
      required: true,
    },
    messages: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
          ref: "users",
          required: true,
        },
        isRead: {
          type: Boolean,
          default: false,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        date: {
          type: String,
          default: new Date().toLocaleDateString(),
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Conversation = new mongoose.model("conversations", conversationSchema);
module.exports = Conversation;
