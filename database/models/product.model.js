import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      required: true,  
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

// productSchema.post("init", (doc) => {
//   doc.pic = process.env.BASE_URL + "Product/" + doc.pic;
// });

export const productModel = mongoose.model("product", productSchema);
