import { invoiceModel } from "../../../database/models/invoice.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";

const createInvoice = catchAsync(async (req, res, next) => {
  // req.body.image = req.files.image[0].filename;
  // console.log(req.files, "req.files");
  var message = "";
  let newInvoice = new invoiceModel(req.body);
  if (req.body.amount < 0) {
    message = "amount must be greater than 0";
    return res.status(400).json({ message });
  }
  let addedInvoice = await newInvoice.save();
  // console.log(req.body);
  res.status(201).json({
    message: "Invoice has been created successfully!",
    addedInvoice,
  });
});

const getAllInvoice = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(invoiceModel.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .search()
    .fields();

  let results = await ApiFeat.mongooseQuery;
  res.json({ message: "done", page: ApiFeat.page, results });
  if (!ApiFeat) {
    return res.status(404).json({
      message: "No Invoice was found!",
    });
  }
});

const searchInvoice = catchAsync(async (req, res, next) => {
  let { InvoiceTitle, filterType, filterValue } = req.params;
  const page = req.query.p - 1 || 0;
  let Invoice = null;
  if (req.query.filter) {
    switch (filterType) {
      case "user":
        await invoiceModel.find({
          id: { $regex: `${filterValue}`, $options: "i" },
        });
        break;
      case "loc":
        await invoiceModel.find({
          id: { $regex: `${filterValue}`, $options: "i" },
        });
        break;
    }
  }
  const numOfInvoicePerPage = req.query.n || 5;
  Invoice = await invoiceModel
    .find({ jobTitle: { $regex: `${InvoiceTitle}`, $options: "i" } })
    .skip(page * numOfInvoicePerPage)
    .limit(numOfInvoicePerPage);
  if (!Invoice) {
    return res.status(404).json({
      message: "No Invoice was found!",
      s,
    });
  }

  res.status(200).json({ Invoice });
});

const getInvoiceById = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let Invoice = await invoiceModel.findById(id);

  if (!Invoice) {
    return res.status(404).json({ message: "Invoice not found!" });
  }

  res.status(200).json({ Invoice });
});
const updateInvoice = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let updatedInvoice = await invoiceModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedInvoice) {
    return res.status(404).json({ message: "Couldn't update!  not found!" });
  }

  res
    .status(200)
    .json({ message: "Invoice updated successfully!", updatedInvoice });
});
const deleteInovice = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let deletedInvoice = await invoiceModel.findByIdAndDelete({ _id: id });

  if (!deletedInvoice) {
    return res.status(404).json({ message: "Couldn't delete!  not found!" });
  }

  res.status(200).json({ message: "Invoice deleted successfully!" });
});
// const deleteAllInovice =
// catchAsync(
//   async (req, res, next) => {

//   let deletedInvoice = await invoiceModel.deleteMany();

//   if (!deletedInvoice) {
//     return res.status(404).json({ message: "Couldn't delete!  not found!" });
//   }

//   res.status(200).json({ message: "Invoice deleted successfully!" });
// }
// );

export {
  createInvoice,
  getAllInvoice,
  searchInvoice,
  getInvoiceById,
  deleteInovice,
  updateInvoice,
};
