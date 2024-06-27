import { photoModel } from "../../../database/models/photo.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";



const createIamge = catchAsync(async (req, res, next) => {

  
  
  // console.log(req.file.filename,"req.file");
  req.body.image = req.file.filename;
  const newIamge = new photoModel(req.body);

  
  const savedIamge = await newIamge.save();
  

  if (!req.body.image) {
    return res.status(404).json({ message: "Couldn't update!  not found!" });
  }

  res.status(201).json({
    message: "Iamge created successfully!",
    savedIamge,
  });
});
const getAllIamge = catchAsync(async (req, res, next) => {
  let ApiFeat = photoModel.find()


  let results = await ApiFeat;
  res.json({ message: "done",  results });
  if (!ApiFeat) {
    return res.status(404).json({
      message: "No Iamge was found!",
    });
  }
});

const editIamge = 
catchAsync(
  async (req, res, next) => {
  const {id} = req.params;

  const updatedIamge = await photoModel.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  if (!updatedIamge) {
    return res.status(404).json({ message: "Iamge not found!" });
  }

  res.status(200).json({
    message: "Iamge updated successfully!",
    updatedIamge,
  });
}
);

const deleteIamge = catchAsync(async (req, res, next) => {
  const {id}  = req.params;

  const deletedIamge = await photoModel.findByIdAndDelete(id);

  if (!deletedIamge) {
    return res.status(404).json({ message: "Iamge not found!" });
  }

  res.status(200).json({ message: "Iamge deleted successfully!" });
});

export { createIamge, editIamge, deleteIamge, getAllIamge };
