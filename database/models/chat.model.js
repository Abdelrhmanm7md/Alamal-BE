import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
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
// chatSchema.post("init", (doc) => {
//   doc.logo = process.env.BASE_URL + "company/" + doc.logo;
// });

export const chatModel = mongoose.model("chat", chatSchema);
