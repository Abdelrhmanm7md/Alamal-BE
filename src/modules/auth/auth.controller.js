import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";
import AppError from "../../utils/appError.js";
import { userModel } from "../../../database/models/user.model.js";

export const signUp = catchAsync(async (req, res, next) => {
  let existUser = await userModel.findOne({ email: req.body.email });
  if (existUser) {
    return next(new AppError(`this email already exist`, 409));
  }
  let results = new userModel(req.body);
  await results.save();
  res.json({ message: "added", results });
});
export const signIn = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;
  let isFound = await userModel.findOne({ email });
  const match = await bcrypt.compare(password, isFound.password);
  if (match && isFound) {
    let token = jwt.sign(
      { name: isFound.name, userId: isFound._id },
      process.env.JWT_SECRET_KEY
    );
    return res.json({ message: "success", token, isFound });
  }
  next(new AppError(`wrong email or password`, 401));
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
