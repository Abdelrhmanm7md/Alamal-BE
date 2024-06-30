import { transModel } from "../../../database/models/trans.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";



const createTrans = catchAsync(async (req, res, next) => {


  const newTrans = new transModel(req.body);
  const savedTrans = await newTrans.save();

  res.status(201).json({
    message: "Transction created successfully!",
    savedTrans,
  });
});
const getAllTrans = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(transModel.find(), req.query)
    .pagination()
    .sort()
    .search()
    .fields();

  let results = await ApiFeat.mongooseQuery;
  res.json({ message: "done", page: ApiFeat.page, results });
  if (!ApiFeat) {
    return res.status(404).json({
      message: "No Transction was found!",
    });
  }
});

const editTrans = 
catchAsync(
  async (req, res, next) => {
  const {id} = req.params;

  const updatedTrans = await transModel.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  if (!updatedTrans) {
    return res.status(404).json({ message: "Transction not found!" });
  }

  res.status(200).json({
    message: "Transction updated successfully!",
    updatedTrans,
  });
}
);

const deleteTrans = catchAsync(async (req, res, next) => {
  const {id}  = req.params;

  const deletedTrans = await transModel.findByIdAndDelete(id);

  if (!deletedTrans) {
    return res.status(404).json({ message: "Transction not found!" });
  }

  res.status(200).json({ message: "Transcation deleted successfully!" });
});

export { createTrans, editTrans, deleteTrans, getAllTrans };
