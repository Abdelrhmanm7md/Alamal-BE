import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    kMessages: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    isTyping: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export const chatModel = mongoose.model("chat", chatSchema);
