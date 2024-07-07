import { tokenModel } from "../../../database/models/token.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";

const createtoken = catchAsync(async (req, res, next) => {
  const newtoken = new tokenModel(req.body);
  const savedtoken = await newtoken.save();

  res.status(201).json({
    message: "token created successfully!",
    savedtoken,
  });
});

const getAlltoken = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(tokenModel.find(), req.query)
    .pagination()
    .sort()
    .search()
    .fields();

  let results = await ApiFeat.mongooseQuery;
  results = JSON.stringify(results);
  results = JSON.parse(results);
  res.json({
    message: "done",
    page: ApiFeat.page,
    count: await tokenModel.countDocuments(),
    results,
  });
  if (!ApiFeat) {
    return res.status(404).json({
      message: "No token was found!",
    });
  }
});

const edittoken = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedtoken = await tokenModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedtoken) {
    return res.status(404).json({ message: "token not found!" });
  }

  res.status(200).json({
    message: "token updated successfully!",
    updatedtoken,
  });
});

const deletetoken = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedtoken = await tokenModel.findByIdAndDelete(id);

  if (!deletedtoken) {
    return res.status(404).json({ message: "token not found!" });
  }

  res.status(200).json({ message: "token deleted successfully!" });
});

export {
  createtoken,
  edittoken,
  deletetoken,
  getAlltoken,
  createPhoto,
};
