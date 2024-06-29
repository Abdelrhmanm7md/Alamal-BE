import mongoose from "mongoose";

const photoSchema = mongoose.Schema(
  {
    image: String,
  },
  { timestamps: true }
);

photoSchema.post("init", (doc) => {
  doc.image = process.env.BASE_URL + "photo/" + doc.image;
});

export const photoModel = mongoose.model("photo", photoSchema);
