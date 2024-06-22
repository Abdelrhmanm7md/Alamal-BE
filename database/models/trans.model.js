import mongoose from "mongoose";

const transSchema = mongoose.Schema(
  {
    amount: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    confirmed: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const transModel = mongoose.model("tran", transSchema);
