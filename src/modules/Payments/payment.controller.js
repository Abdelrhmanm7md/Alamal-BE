import { paymentModel } from "../../../database/models/payments.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";

const createpayment = catchAsync(async (req, res, next) => {
  if (req.body.amount < 0) {
    let message = "amount must be greater than 0";
    return res.status(400).json({ message });
  }
  let newpayment = new paymentModel(req.body);

  let addedpayment = await newpayment.save();

  res.status(201).json({
    message: " payment has been created successfully!",
    addedpayment,
  });
});

const getAllpayment = catchAsync(async (req, res, next) => {
  let ApiFeat = null;
  if (req.params.id) {
    ApiFeat = new ApiFeature(
      paymentModel
        .find({ createdBy: req.params.id })
        .populate("pharm rep company createdBy"),
      req.query
    )
      .pagination()
      .sort()
      .search(req.query.key)
      .fields();
  } else {
    ApiFeat = new ApiFeature(
      paymentModel.find().populate("pharm rep company createdBy"),
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
      // if(filterType.("pharmacy")){
      if (filterType == "pharmacy") {
        return item.pharm.name.toLowerCase().includes(filterValue);
      }
      if (filterType == "rep") {
        return item.rep.name.toLowerCase().includes(filterValue);
      }
      if (filterType == "company") {
        return item.company.name.toLowerCase().includes(filterValue);
      }
      if (filterType == "createdBy") {
        return item.createdBy.name.toLowerCase().includes(filterValue);
      }
      if (filterType == "date") {
        return item.paymentDate == filterValue;
      }
      if (filterType == "location") {
        return item.pharm.location.toLowerCase().includes(filterValue);
      }
    });
  }
  res.json({ message: "done", page: ApiFeat.page, results });
  if (!ApiFeat) {
    return res.status(404).json({
      message: "No Payment was found!",
    });
  }
});
const getAllpaymentByInvoice = catchAsync(async (req, res, next) => {
  let ApiFeat = null;
  if (req.params.id) {
    ApiFeat = new ApiFeature(
      paymentModel
        .find({ invoice: req.params.id })
        .populate("pharm rep company createdBy"),
      req.query
    )
      .pagination()
      .sort()
      .search(req.query.key)
      .fields();
  } else {
    ApiFeat = new ApiFeature(
      paymentModel.find().populate("pharm rep company createdBy"),
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
      // if(filterType.("pharmacy")){
      if (filterType == "pharmacy") {
        return item.pharm.name.toLowerCase().includes(filterValue);
      }
      if (filterType == "rep") {
        return item.rep.name.toLowerCase().includes(filterValue);
      }
      if (filterType == "company") {
        return item.company.name.toLowerCase().includes(filterValue);
      }
      if (filterType == "createdBy") {
        return item.createdBy.name.toLowerCase().includes(filterValue);
      }
      if (filterType == "date") {
        return item.paymentDate == filterValue;
      }
      if (filterType == "location") {
        return item.pharm.location.toLowerCase().includes(filterValue);
      }
    });
  }
  res.json({ message: "done", page: ApiFeat.page, results });
  if (!ApiFeat) {
    return res.status(404).json({
      message: "No Payment was found!",
    });
  }
});

const searchpayment = catchAsync(async (req, res, next) => {
  let { paymentTitle } = req.params;
  console.log(req.query.p);
  const page = req.query.p - 1 || 0;
  const numOfpaymentPerPage = req.query.n || 5;
  let payment = await paymentModel
    .find({ jobTitle: { $regex: `${paymentTitle}`, $options: "i" } })
    .skip(page * numOfpaymentPerPage)
    .limit(numOfpaymentPerPage);
  if (!payment) {
    return res.status(404).json({
      message: "No payment was found!",
      s,
    });
  }

  res.status(200).json({ payment });
});

const updatePayment = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  if (req.body.amount < 0) {
    let message = "amount must be greater than 0";
    return res.status(400).json({ message });
  }

  let updatedPayment = await paymentModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedPayment) {
    return res.status(404).json({ message: "Couldn't update!  not found!" });
  }

  res
    .status(200)
    .json({ message: "Payment updated successfully!", updatedPayment });
});
const deletePayment = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let deletedPayment = await paymentModel.findByIdAndDelete({ _id: id });

  if (!deletedPayment) {
    return res.status(404).json({ message: "Couldn't delete!  not found!" });
  }

  res.status(200).json({ message: "Payment deleted successfully!" });
});
export {
  createpayment,
  getAllpayment,
  searchpayment,
  updatePayment,
  deletePayment,
  getAllpaymentByInvoice,
};
