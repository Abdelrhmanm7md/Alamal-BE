import { chatModel } from "../../../database/models/chat.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";

const createchat = catchAsync(async (req, res, next) => {
  const newchat = new chatModel(req.body);
  const savedchat = await newchat.save();

  res.status(201).json({
    message: "chat created successfully!",
    savedchat,
  });
});
const createPhoto = catchAsync(async (req, res, next) => {
  if (req.file) req.body.logo = req.file.filename;
  let logo = "";
  if (req.body.logo) {
    logo = req.body.logo;
  }

  if (!req.body.logo) {
    return res.status(404).json({ message: "Logo not found!" });
  }
  res.status(200).json({
    message: "Photo uploaded successfully!",
    logo: `${process.env.BASE_URL}invoices/${logo}`,
  });
});
const getAllchat = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(chatModel.find(), req.query)
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
    count: await chatModel.countDocuments(),
    results,
  });
  if (!ApiFeat) {
    return res.status(404).json({
      message: "No chat was found!",
    });
  }
});

const editchat = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedchat = await chatModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedchat) {
    return res.status(404).json({ message: "chat not found!" });
  }

  res.status(200).json({
    message: "chat updated successfully!",
    updatedchat,
  });
});

const deletechat = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedchat = await chatModel.findByIdAndDelete(id);

  if (!deletedchat) {
    return res.status(404).json({ message: "chat not found!" });
  }

  res.status(200).json({ message: "chat deleted successfully!" });
});

export {
  createchat,
  editchat,
  deletechat,
  getAllchat,
  createPhoto,
};
