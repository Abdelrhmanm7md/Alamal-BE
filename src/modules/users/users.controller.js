import { userModel } from "../../../database/models/user.model.js";

import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";
import AppError from "../../utils/appError.js";

const createUser = catchAsync(async (req, res, next) => {
  let userExists = await userModel.findOne({ email: req.body.email });

  if (userExists) {
    return res.status(409).json({
      message: "Email already exists!",
    });
  }

  let newUser = new userModel(req.body);
  let addedUser = await newUser.save();

  res.status(201).json({
    message: "User created successfully!",
    addedUser,
  });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(userModel.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .search()
    .fields();

  let results = await ApiFeat.mongooseQuery;
  res.json({ message: "done", page: ApiFeat.page, results });
  if (!results) {
    return res.status(404).json({
      message: "No users was found! Create a new user to get started!",
    });
  }
});

const getUserById = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let results = await userModel.findById(id);
  !results && next(new AppError(`not found `, 404));
  results && res.json({ message: "done", results });
});

const updateUser = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let results = await userModel.findByIdAndUpdate(
    id,req.body,
    { new: true }
  );
  !results && next(new AppError(`not found `, 404));
  results && res.json({ message: "updatedd", results });
});

const deleteUser = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let deletedUser = await userModel.findByIdAndDelete(id);

  if (!deletedUser) {
    return res
      .status(404)
      .json({ message: "Couldn't delete! User not found!" });
  }

  res.status(200).json({ message: "User deleted successfully!" });
});

export { createUser, getAllUsers, getUserById, updateUser, deleteUser };
