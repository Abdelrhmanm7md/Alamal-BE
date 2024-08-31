import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    messages: 
      [
        {
          sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
          message: String,
        },
      ],
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const chatModel = mongoose.model("chat", chatSchema);
