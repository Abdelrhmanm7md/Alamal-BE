import mongoose from "mongoose";

const tokenSchema = mongoose.Schema(
  {
    kAccessToken: {
      type: String,
      required: true,
    },
    kRefreshToken: {
        type: String,
        required: true,
    },
    kUserId: {
      type: Number,
      required: true,
    },
    kAccessTokenExpirationMsSinceEpoch: {
        type: Number,
        required: true,
    },
  },
  { timestamps: true }
);


export const tokenModel = mongoose.model("token", tokenSchema);
