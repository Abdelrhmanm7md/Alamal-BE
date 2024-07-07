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
const createPhoto = catchAsync(async (req, res, next) => {
  if (req.file) req.body.profilePic = req.file.filename;
  let profilePic = "";
  if (req.body.profilePic) {
    profilePic = req.body.profilePic;
  }
  if (!req.body.profilePic) {
    return res.status(404).json({ message: "Couldn't update!  not found!" });
  }
  res
    .status(200)
    .json({
      message: "Photo updated successfully!",
      profilePic: `${process.env.BASE_URL}invoices/${profilePic}`,
    });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(userModel.find(), req.query)
    // .pagination()
    .sort()
    .search()
    .fields();

  let results = await ApiFeat.mongooseQuery;
  results = JSON.stringify(results);
  results = JSON.parse(results);

  // let { filterType, filterValue } = req.query;
  // if(filterType&& filterValue){
  //   results = results.filter(function (item) {
  //     if (filterType == "name") {
  //       return item.name.toLowerCase().includes(filterValue);
  //     }
  //     if (filterType == "location") {
  //       return item.location.toLowerCase().includes(filterValue);
  //     }
  //   });
  // }
  res.json({ message: "done", page: ApiFeat.page,count: await userModel.countDocuments(), results });
  if (!results) {
    return res.status(404).json({
      message: "No users was found! Create a new user to get started!",
    });
  }
});
const getAllRep = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(userModel.find({ role: "rep" }), req.query)
    .pagination()
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
const getAllPharm = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(userModel.find({ role: "pharm" }), req.query)
    .pagination()
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
const getAllAcc = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(
    userModel.find({ role: "accountant" }),
    req.query
  )
    .pagination()
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
const getAllAdmin = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(userModel.find({ role: "admin" }), req.query)
    .pagination()
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
const getAllSaleManger = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(userModel.find({ role: "Smanger" }), req.query)
    .pagination()
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
const getAllSuper = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(
    userModel.find({ role: "supervisor" }),
    req.query
  )
    .pagination()
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
const getAllDriver = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(userModel.find({ role: "driver" }), req.query)
    .pagination()
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

  let results = await userModel.findByIdAndUpdate(id, req.body, { new: true });
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

export {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllPharm,
  getAllRep,
  getAllAcc,
  getAllAdmin,
  getAllDriver,
  getAllSaleManger,
  getAllSuper,
  createPhoto,
};
