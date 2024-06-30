import { invoiceModel } from "../../../database/models/invoice.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";

const createInvoice = catchAsync(async (req, res, next) => {
  var message = "";
  let newInvoice = new invoiceModel(req.body);
  if (req.body.amount < 0) {
    message = "amount must be greater than 0";
    return res.status(400).json({ message });
  }

  let addedInvoice = await newInvoice.save();
  addedInvoice.productLines.map((element) => {
    element.invoiceId = addedInvoice._id;
  });
  // console.log(req.body);
  res.status(201).json({
    message: "Invoice has been created successfully!",
    addedInvoice,
  });
});
const createPhoto = catchAsync(async (req, res, next) => {
  // console.log(req, "ddddd");

  if (req.file) req.body.image = req.file.filename;
  let image = "";
  if (req.body.image) {
    image = req.body.image;
  }

  if (!req.body.image) {
    return res.status(404).json({ message: "Couldn't update!  not found!" });
  }
  res.status(200).json({
    message: "Photo updated successfully!",
    image: `${process.env.BASE_URL}invoices/${image}`,
  });
});

const getAllInvoice = catchAsync(async (req, res, next) => {
  // let ApiFeat = invoiceModel.find().populate("pharmacy productLines.product payments");


  let ApiFeat = new ApiFeature(
    invoiceModel
      .find()
      .populate("pharmacy productLines.product payments company"),
    req.query
  )
    .pagination()
    .sort()
    .search(req.query.key)
    .fields();

  switch (req.user.role) {
    case "pharm":
    case "rep":
      case "diver":
        ApiFeat = new ApiFeature(
          invoiceModel.find({ $or: [{ medicalRep: req.user._id }, { pharmacy: req.user._id }] }).populate("pharmacy productLines.product payments"),
          req.query
        )
          .pagination()
          .sort()
          .search(req.query.key)
          .fields();
          break;
          default:

        ApiFeat = new ApiFeature(
          invoiceModel.find().populate("pharmacy productLines.product payments"),
          req.query
        )
          .pagination()
          .sort()
          .search(req.query.key)
          .fields();
      break;
  }

  let numPages = invoiceModel
    .find()
    .populate("pharmacy productLines.product payments")
    .countDocuments();
  // console.log(numPages);
  let results = await ApiFeat.mongooseQuery;
  // console.log(ApiFeat);
  results = JSON.stringify(results);
  results = JSON.parse(results);
  // console.log(req);
  let { filterType, filterValue } = req.query;

  // console.log(filterType, filterValue);
  // console.log(results);
  if(filterType&& filterValue){

    results = results.filter(function (item) {
      // if(filterType.("pharmacy")){
        if (filterType == "pharmacy") {
          return item.pharmacy.name.toLowerCase().includes(filterValue);
        }
        if (filterType == "company") {
          return item.company.name.toLowerCase().includes(filterValue);
        }
        if (filterType == "medicalRep") {
          return item.medicalRep.name.toLowerCase().includes(filterValue);
        }
        if (filterType == "date") {
          return item.date == filterValue;
        }
        if (filterType == "location") {
          return item.pharmacy.location.toLowerCase().includes(filterValue);
        }
      });
    }
  //   switch (req.query.filterType) {
  //     case req.query.filterType == "pharmacy":
  //       console.log(req.query.filterValue);
  //       return item.pharmacy.name.includes(req.query.filterValue);
  //     case "company":
  //       return item.company.name == req.query.filterValue;
  //   }
  //   return item.pharmacy.name == req.query.filter;
  for (let j = 0; j < results.length; j++) {
    for (let i = 0; i < results[j].productLines.length; i++) {
      if (results[j].productLines[i].product) {
        results[j].productLines[i].total =
          results[j].productLines[i].qty *
          results[j].productLines[i].product.unitPrice;
      }
    }
    let totalAmt = 0;
    for (let i = 0; i < results[j].payments.length; i++) {
      totalAmt += results[j].payments[i].amount;
    }
    results[j].totalPaid = totalAmt;
    results[j].amountDue = results[j].amount - results[j].totalPaid;
    // console.log(results[j].amountDue);
  }
  res.json({
    message: "done",
    page: ApiFeat.page,
    results,
  });
  if (!ApiFeat) {
    return res.status(404).json({
      message: "No Invoice was found!",
    });
  }
});

const searchInvoice = catchAsync(async (req, res, next) => {
  let { InvoiceTitle, filterType, filterValue } = req.query;
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
    });
  }

  res.status(200).json({ Invoice });
});

const getInvoiceById = catchAsync(async (req, res, next) => {
  let { id } = req.query;

  let Invoice = await invoiceModel
    .findById(id)
    .populate("payments")
    .populate("productLines.product");
  Invoice = JSON.stringify(Invoice);
  Invoice = JSON.parse(Invoice);

  if (!Invoice) {
    return res.status(404).json({ message: "Invoice not found!" });
  }

  for (let i = 0; i < Invoice.productLines.length; i++) {
    Invoice.productLines[i].total =
      Invoice.productLines[i].qty * Invoice.productLines[i].product.unitPrice;
  }
  let totalAmt = 0;
  for (let i = 0; i < Invoice.payments.length; i++) {
    totalAmt += Invoice.payments[i].amount;
  }
  Invoice.totalPaid = totalAmt;
  Invoice.amountDue = Invoice.amount - Invoice.totalPaid;

  res.status(200).json({ Invoice });
});
const getInvByUserId = catchAsync(async (req, res, next) => {
  let { id } = req.query;

  let Invoice = await invoiceModel
    .find({createdBy:id})
    .populate("payments")
    .populate("productLines.product");
  Invoice = JSON.stringify(Invoice);
  Invoice = JSON.parse(Invoice);

  if (!Invoice) {
    return res.status(404).json({ message: "Invoice not found!" });
  }

  for (let i = 0; i < Invoice.productLines.length; i++) {
    Invoice.productLines[i].total =
      Invoice.productLines[i].qty * Invoice.productLines[i].product.unitPrice;
  }
  let totalAmt = 0;
  for (let i = 0; i < Invoice.payments.length; i++) {
    totalAmt += Invoice.payments[i].amount;
  }
  Invoice.totalPaid = totalAmt;
  Invoice.amountDue = Invoice.amount - Invoice.totalPaid;

  res.status(200).json({ Invoice });
});
const updateInvoice = catchAsync(async (req, res, next) => {
  let { id } = req.query;

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
  let { id } = req.query;

  let deletedInvoice = await invoiceModel.findByIdAndDelete({ _id: id });

  if (!deletedInvoice) {
    return res.status(404).json({ message: "Couldn't delete!  not found!" });
  }

  res.status(200).json({ message: "Invoice deleted successfully!" });
});

export {
  createInvoice,
  getAllInvoice,
  searchInvoice,
  getInvoiceById,
  deleteInovice,
  updateInvoice,
  createPhoto,
  getInvByUserId
};
