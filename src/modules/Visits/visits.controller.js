import { visitModel } from "../../../database/models/visit.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";


const createVisit = catchAsync(async (req, res, next) => {
  
  const { title, content, tags } = req.body;
  const author = req.user._id;

  const newVisit = new visitModel({ title, content, author, tags });
  const savedVisit = await newVisit.save();
  res.status(201).json({
    message: "Visit created successfully!",
     savedVisit
  });
});

const editVisit = catchAsync(async (req, res, next) => {
  const visitId = req.params;

  const updatedVisit = await visitModel.findByIdAndUpdate(
    visitId,
    req.body,
    { new: true }
  );

  if (!updatedVisit) {
    return res.status(404).json({ message: "Visit not found!" });
  }

  res.status(200).json({
    message: "Visit updated successfully!",
    updatedVisit
  });
});

const deleteVisit = catchAsync(async (req, res, next) => {
  const visitId = req.params;

  const deletedVisit = await visitModel.findByIdAndDelete(visitId);

  if (!deletedVisit) {
    return res.status(404).json({ message: "Visit not found!" });
  }

  res.status(200).json({ message: "Visit deleted successfully!" });
});

const getAllVisits = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(visitModel.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .search()
    .fields();

  let results = await ApiFeat.mongooseQuery;
  res.json({ message: "done", page: ApiFeat.page, results });
  if (!ApiFeat) {
    return res.status(404).json({
      message: "No visit was found!",
    });
  }
});

export { createVisit, editVisit, deleteVisit,getAllVisits };
