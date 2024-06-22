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

paymentSchema.post("init", (doc) => {
  doc.logo = process.env.BASE_URL + "photos/" + doc.logo;
  if (doc.images)
    doc.images = doc.images.map(
      (path) => process.env.BASE_URL + "photos/" + path
    );
});

export const paymentModel = mongoose.model("payment", paymentSchema);
