import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invoice",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
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
    paymentDate: {
      type: Date,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
  },
  { timestamps: true }
);



export const paymentModel = mongoose.model("payment", paymentSchema);
