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
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    pharm: {
      type: String,
      required: true,
    },
    rep: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);



export const paymentModel = mongoose.model("payment", paymentSchema);
