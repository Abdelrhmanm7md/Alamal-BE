import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    invoiceType: {
      type: String,
      enum: ["normal", "return"],
      default: "normal",
      required: true,
    },
    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    locationX: {
      type: String,
    },
    locationY: {
      type: String,
    },
    invoiceStatus: {
      type: String,
      enum: ["notPaid", "partiallyPaid", "totallyPaid"],
      default: "notPaid",
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["preparing", "delivered", "delivering"],
      default: "preparing",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    image: String,
    rep: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    dropComment: {
      type: String,
      required: true,
    },
    dropStatus: {
      type: String,
      required: true,
    },
    // payments: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   ref: "payment",
    // },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    productLines: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
          qty: Number,
        },
      ],
      // required: true,
    },
  },
  { timestamps: true }
);

// invoiceSchema.post("init", (doc) => {
//   doc.image = process.env.BASE_URL + "invoices/" + doc.image;
// });

export const invoiceModel = mongoose.model("invoice", invoiceSchema);
