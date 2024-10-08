import { transModel } from "../../../database/models/trans.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";

const createTrans = catchAsync(async (req, res, next) => {
  const newTrans = new transModel(req.body);
  if (req.body.amount < 0) {
    let message = "amount must be greater than 0";
    return res.status(400).json({ message });
  }
  const savedTrans = await newTrans.save();

  res.status(201).json({
    message: "Transction created successfully!",
    savedTrans,
  });
});
const getAllTransByUser = catchAsync(async (req, res, next) => {
  let ApiFeat = null;
  if (req.params.id) {
    ApiFeat = new ApiFeature(
      transModel
        .find({ $or: [{ receiver: req.params.id }, { sender: req.params.id }] })
        .populate("receiver")
        .populate("sender"),
      req.query
    )
      .pagination()
      .sort()
      .search(req.query.key)
      .fields();
  }

  let results = await ApiFeat.mongooseQuery;
  results = JSON.stringify(results);
  results = JSON.parse(results);

  let { filterType, filterValue } = req.query;
  if (filterType && filterValue) {
    results = results.filter(function (item) {
      if (filterType == "sender") {
        if (item.sender) {
          return item.sender.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "receiver") {
        if (item.receiver) {
          return item.receiver.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "confirmed") {
        return item.confirmed.toLowerCase().includes(filterValue.toLowerCase());
      }
    });
  }
  if (!ApiFeat || !results) {
    return res.status(404).json({
      message: "No Transction was found!",
    });
  }
  res.json({
    message: "Done",
    page: ApiFeat.page,
    count: await transModel.countDocuments({
      $or: [{ receiver: req.params.id }, { sender: req.params.id }],
    }),
    results,
  });
});
const getAllTransByAdmin = catchAsync(async (req, res, next) => {
  let ApiFeat = null;

  ApiFeat = new ApiFeature(
    transModel.find().populate("receiver").populate("sender"),
    req.query
  )
    .pagination()
    .sort()
    .search(req.query.key)
    .fields();

  let results = await ApiFeat.mongooseQuery;
  results = JSON.stringify(results);
  results = JSON.parse(results);

  let { filterType, filterValue } = req.query;
  if (filterType && filterValue) {
    results = results.filter(function (item) {
      if (filterType == "sender") {
        if (item.sender) {
          return item.sender.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "receiver") {
        if (item.receiver) {
          return item.receiver.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "confirmed") {
        return item.confirmed.toLowerCase().includes(filterValue.toLowerCase());
      }
    });
  }
  if (!ApiFeat || !results) {
    return res.status(404).json({
      message: "No Transction was found!",
    });
  }
  res.json({
    message: "Done",
    page: ApiFeat.page,
    count: await transModel.countDocuments(),
    results,
  });
});

const editTrans = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedTrans = await transModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (req.body.amount < 0) {
    let message = "amount must be greater than 0";
    return res.status(400).json({ message });
  }

  if (!updatedTrans) {
    return res.status(404).json({ message: "Transction not found!" });
  }

  res.status(200).json({
    message: "Transction updated successfully!",
    updatedTrans,
  });
});

const deleteTrans = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedTrans = await transModel.findByIdAndDelete(id);

  if (!deletedTrans) {
    return res.status(404).json({ message: "Transction not found!" });
  }

  res.status(200).json({ message: "Transcation deleted successfully!" });
});

export {
  createTrans,
  editTrans,
  deleteTrans,
  getAllTransByUser,
  getAllTransByAdmin,
};
