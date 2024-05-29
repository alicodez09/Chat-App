const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "users",
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "users",
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "messages",
      },
    ],
  },
  { timestamps: true }
);
const MessageModel = mongoose.model("messages", messageSchema);

const ConversationModel = mongoose.model("conversations", conversationSchema);
module.exports = {
  MessageModel,
  ConversationModel,
};
