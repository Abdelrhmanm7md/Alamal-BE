import mongoose from "mongoose";

const visitSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Date,
      required: true,
    },
    pervJobTitle: {
      type: String,
      required: true,
    },
    linkedinUrl: {
      type: String,
      required: true,
    },
    protfolioUrl: {
      type: String,
    },
    addInfo: {
      type: String,
    },
    attachedResume: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

visitSchema.post("init", (doc) => {
  doc.attachedResume = process.env.BASE_URL + "resumes/" + doc.attachedResume;
});

export const visitModel = mongoose.model("visit", visitSchema);
