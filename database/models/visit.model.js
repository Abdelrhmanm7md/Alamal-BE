import mongoose from "mongoose";

const visitSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  
  },
  { timestamps: true }
);



export const visitModel = mongoose.model("visit", visitSchema);
