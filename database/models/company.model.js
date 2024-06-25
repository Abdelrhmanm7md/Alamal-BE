import mongoose from "mongoose";

const companySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    desc: {
      type: String,
    },
    location: {
      type: String,
      required: true

    },
    logo: {
      type: String,
    },
  },
  { timestamps: true }
);



export const companyModel = mongoose.model("company", companySchema);
