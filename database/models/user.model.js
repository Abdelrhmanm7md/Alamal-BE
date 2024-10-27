import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is a required field."],
      minLength: [2, "Name is too short."],
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is a required field."],
      minLength: 6,
      unique: [true, "Email must be unique."],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters long."],
    },
    location: {
      type: String,
    },
    profilePic: String,
    role: {
      type: String,
      enum: [
        "pharmacy",
        "rep",
        "admin",
        "driver",
        "supervisor",
        "Smanger",
        "accountant",
      ],
      default: "pharmacy",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    relations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      // required: true,
    }],
    verificationCode: {
      type: String,
      // required:true
    },
  },
  { timestamps: true }
);

// userSchema.post("init", (doc) => {
//   doc.profilePic = process.env.BASE_URL + "profilePic/" + doc.profilePic;
// });

userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, Number(process.env.SALTED_VALUE));
});
userSchema.pre("findOneAndUpdate", function () {
  if (this._update.password) {
    this._update.password = bcrypt.hashSync(this._update.password, Number(process.env.SALTED_VALUE));
  }
});

export const userModel = mongoose.model("user", userSchema);
