import { paymentModel } from "../../../database/models/payments.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";



const createpayment = catchAsync(async (req, res, next) => {
  req.body.attachedResume = req.files.attachedResume[0].filename;
  console.log(req.files, "req.files");
  let newpayment = new paymentModel(req.body);
  let addedpayment = await newpayment.save();
  console.log(req.body);

  res.status(201).json({
    message: " payment has been created successfully!",
  });
});

const getAllpayment = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(paymentModel.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .search()
    .fields();

  let results = await ApiFeat.mongooseQuery;
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

const getpaymentById = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let payment = await paymentModel.findById(id);

  if (!payment) {
    return res.status(404).json({ message: "payment not found!" });
  }

  res.status(200).json({ payment });
});
const updatePayment = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  let { name } = req.body;

  let updatedPayment = await paymentModel.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );

  if (!updatedPayment) {
    return res
      .status(404)
      .json({ message: "Couldn't update!  not found!" });
  }

  res.status(200).json({ message: "Payment updated successfully!",updatedPayment });
});
const deletePayment = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let deletedPayment = await paymentModel.findByIdAndDelete({_id:id});

  if (!deletedPayment) {
    return res
      .status(404)
      .json({ message: "Couldn't delete!  not found!" });
  }

  res.status(200).json({ message: "Payment deleted successfully!" });
});
export { createpayment, getAllpayment, searchpayment, getpaymentById, updatePayment, deletePayment };
