import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";
import AppError from "../../utils/appError.js";
import { userModel } from "../../../database/models/user.model.js";
import { sendEmail } from "../../email/sendEmail.js";

export const signUp = catchAsync(async (req, res, next) => {
  let emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (req.body.email !== "" && req.body.email.match(emailFormat)) {
    let existUser = await userModel.findOne({ email: req.body.email });
    if (existUser) {
      return res.status(409).json({ message: "this email already exist" });
    }
    if (req.body.role == "pharmacy") {
      if (req.body.name) {
        let existUser = await userModel.findOne({ name: req.body.name });
        if (existUser) {
          return res.status(409).json({ message: "this name already exist" });
        }
      }
    }
  } else {
    return res.status(409).json({ message: "this email is not valid" });
  }
  req.body.profilePic="http://194.164.72.211:8008/profilePic/avatar.png";
  let results = new userModel(req.body);
  await results.save();
  res.json({ message: "added", results });
});

export const signIn = catchAsync(async (req, res, next) => {
  let emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (req.body.email !== "" && req.body.email.match(emailFormat)) {
    let { email, password } = req.body;
    let isFound = await userModel.findOne({ email });
    if (!isFound) return res.status(404).json({ message: "Email Not Found" });
    const match = await bcrypt.compare(password, isFound.password);
    if (match && isFound) {
      // isFound.verificationCode = generateUniqueId({
      //   length: 6,
      //   useLetters: false,
      // });
      // sendEmail(isFound.email, isFound.verificationCode);
      // await isFound.save();
      let token = jwt.sign(
        { name: isFound.name, userId: isFound._id },
        process.env.JWT_SECRET_KEY
      );
      return res.json({ message: "success", token, isFound });
    }else{
      return res.status(401).json({ message: "worng email or password" });
    }
  } else {
    return res.status(409).json({ message: "this email is not valid" });
  }
});
export const forgetPassword = catchAsync(async (req, res, next) => {
  let emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (req.body.email !== "" && req.body.email.match(emailFormat)) {
    let { email } = req.body;
    let isFound = await userModel.findOne({ email });
    if (!isFound) return res.status(404).json({ message: "Email Not Found" });
      sendEmail(isFound.email, isFound.verificationCode);
      // await isFound.save();
      let verificationCode = isFound.verificationCode
      let id = isFound._id
      return res.json({ message: "Verification Code",verificationCode ,id });
    
    }else{
    return res.status(409).json({ message: "this email is not valid" });
  }
});

// 1- check we have token or not
// 2- verfy token
// 3 if user of this token exist or not
// 4- check if this token is the last one or not (change password )

export const protectRoutes = catchAsync(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) {
    return next(new AppError(`please login first`, 401));
  }
  let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  let user = await userModel.findById(decoded.userId);
  if (!user) {
    return next(new AppError(`user Invalid`, 401));
  }
  if (user.changePasswordAt) {
    let changePasswordTime = parseInt(user.changePasswordAt.getTime() / 1000);
    if (changePasswordTime > decoded.iat) {
      return next(new AppError(`token Invalid`, 401));
    }
  }
  req.user = user;
  next();
});

export const allowTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`you don't have permission`, 403));
    }
    next();
  };
};
