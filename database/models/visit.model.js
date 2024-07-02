import mongoose from "mongoose";

const visitSchema = mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    hasPayment: {
      type: Boolean,
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    pharm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    rep: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const visitModel = mongoose.model("visit", visitSchema);
