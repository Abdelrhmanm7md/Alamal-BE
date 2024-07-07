import mongoose from "mongoose";

const tokenSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
  },
  { timestamps: true }
);
// tokenSchema.post("init", (doc) => {
//   doc.logo = process.env.BASE_URL + "token/" + doc.logo;
// });

export const tokenModel = mongoose.model("token", tokenSchema);
