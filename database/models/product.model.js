import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "Name must be unique."],
    },
    desc: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      // required: true,
    },
    unitPrice: {
      type: Number,
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


export const productModel = mongoose.model("product", productSchema);
