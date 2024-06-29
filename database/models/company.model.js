import mongoose from "mongoose";

const companySchema = mongoose.Schema(
  {
    name: {
      type: String,
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
companySchema.post("init", (doc) => {
  doc.logo = process.env.BASE_URL + "photo/" + doc.logo;
});



export const companyModel = mongoose.model("company", companySchema);
