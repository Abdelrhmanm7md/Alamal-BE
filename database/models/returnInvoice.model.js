import mongoose from "mongoose";

const returnInvoiceSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
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
      type: String,
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
      // required: true,
    },
    isAcceptedByAccOrAdmin:{
      type:Boolean,
      default:false,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    resources: {
        lng: { type: String ,required: true,},
        lat: { type: String ,required: true,},
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

export const returnInvoiceModel = mongoose.model("returnInvoice", returnInvoiceSchema);
