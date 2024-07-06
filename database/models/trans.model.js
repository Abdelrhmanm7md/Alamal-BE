import mongoose from "mongoose";

const transSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
    },
    confirmed: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
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
  },
  { timestamps: true }
);

export const transModel = mongoose.model("tran", transSchema);
