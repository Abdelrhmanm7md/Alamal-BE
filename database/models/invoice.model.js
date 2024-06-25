import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    invoiceStatus: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    image: String,
    medicalRep: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    payments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "payment",
      required: true,
    },
    productLines: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
          qty: Number,
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

// invoiceSchema.post("init", (doc) => {
//   doc.image = process.env.BASE_URL + "invoices/" + doc.image;
// });

export const invoiceModel = mongoose.model("invoice", invoiceSchema);
