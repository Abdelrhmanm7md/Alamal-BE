import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    kText: {
      type: String,
      required: true,
    },
    kSentAtMsSinceEpoch: {
        type: Number,
        required: true,
    },
    kReceivedAtMsSinceEpoch: {
        type: Number,
        required: true,
    },
    kSenderUserId: {
        type: Number,
        required: true,
    },
    kReceiverUserId: {
        type: Number,
        required: true,
    },
  },
  { timestamps: true }
);

export const messageModel = mongoose.model("message", messageSchema);
