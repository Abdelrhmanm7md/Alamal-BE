import { notificationModel } from "../../../database/models/notification.model.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";



const getAllNotification = catchAsync(async (req, res, next) => {
  let results = await notificationModel.find();
  res.json({ message: "done", results });
});

const createNotification = catchAsync(async (req, res, next) => {

  const newNotif = new notificationModel(req.body);
  const savedNotif = await newNotif.save();

  res.status(201).json({
    message: "notification created successfully!",
    post: savedNotif,
  });
});

const deleteNotification =
// catchAsync(
  async (req, res, next) => {
  const {id} = req.params;

  const deletedNotification = await notificationModel.findByIdAndDelete(id);

  if (!deletedNotification) {
    return res.status(404).json({ message: "notification not found!" });
  }

  res.status(200).json({ message: "notification deleted successfully!" });
}
// );

export { createNotification, deleteNotification, getAllNotification };
