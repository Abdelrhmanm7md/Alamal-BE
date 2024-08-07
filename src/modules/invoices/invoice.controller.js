import mongoose from "mongoose";
import { invoiceModel } from "../../../database/models/invoice.model.js";
import { paymentModel } from "../../../database/models/payments.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";
import path from "path";
import fsExtra from "fs-extra";
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

  res.status(201).json({
    message: "Invoice has been created successfully!",
    addedInvoice,
  });
});
const createProductLines = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let addedProductLine = await invoiceModel
    .findByIdAndUpdate(
      { _id: id },
      { $push: { productLines: req.body.productLines } },
      {
        new: true,
      }
    )
    .populate("productLines.product");

  if (!addedProductLine) {
    return res.status(404).json({ message: "Couldn't update!  not found!" });
  }

  res.status(201).json({
    message: "product lines has been created successfully!",
    addedProductLine,
  });
});
const deleteProductLines = catchAsync(async (req, res, next) => {
  let { invId,lineId } = req.params;

  let deletedInvoice = await invoiceModel.findOneAndUpdate(
    { _id: invId },
    { $pull: { productLines: { _id: lineId } } },
    false,
    true
  );

  if (!deletedInvoice) {
    return res.status(404).json({ message: "Couldn't delete!  not found!" });
  }

  res.status(201).json({
    message: "product lines has been deleted successfully!",
    deletedInvoice
  });
});
// const createPhoto = catchAsync(async (req, res, next) => {
//   // console.log(req, "ddddd");

//   if (req.file) req.body.image = req.file.filename;
//   let image = "";
//   if (req.body.image) {
//     image = req.body.image;
//   }

//   if (!req.body.image) {
//     return res.status(404).json({ message: "Couldn't update!  not found!" });
//   }
//   res.status(200).json({
//     message: "Photo updated successfully!",
//     image: `${process.env.BASE_URL}image/${image}`,
//   });
// });

const addPhotos = catchAsync(async (req, res, next) => {
  let image = "";
  req.body.image =
    req.files.image &&
    req.files.image.map(
      (file) =>
        `${process.env.BASE_URL}invoices/${file.filename.split(" ").join("")}`
    );

  const directoryPath = path.join(image, "uploads/invoices");

  fsExtra.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.error("Unable to scan directory: " + err);
    }

    files.forEach((file) => {
      const oldPath = path.join(directoryPath, file);
      const newPath = path.join(directoryPath, file.replace(/\s+/g, ""));

      fsExtra.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error("Error renaming file: ", err);
        }
      });
    });
  });

  if (req.body.image) {
    image = req.body.image;
  }
  if (image !== "") {
    image = image[0];
    res.status(200).json({
      message: "Photo created successfully!",
      image,
    });
  } else {
    res.status(400).json({ message: "File upload failed." });
  }
});

const getAllInvoiceByUser = catchAsync(async (req, res, next) => {
  let ApiFeat = null;
  if (req.params.id) {
    ApiFeat = new ApiFeature(
      invoiceModel
        .find({
          $or: [
            { createdBy: req.params.id },
            { pharmacy: req.params.id },
            { rep: req.params.id },
            { driver: req.params.id },
          ],
        })
        .populate("createdBy rep pharmacy productLines.product company"),
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
      if (filterType == "pharmacy") {
        if(item.pharmacy){
          return item.pharmacy.name.toLowerCase().includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "company") {
        if(item.company){
          return item.company.name.toLowerCase().includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "createdBy") {
        if(item.createdBy){
          return item.createdBy.name.toLowerCase().includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "rep") {
        if(item.rep){
          return item.rep.name.toLowerCase().includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "date") {
        return item.date == filterValue;
      }
      if (filterType == "location") {
        if(item.pharmacy){
          return item.pharmacy.location.toLowerCase().includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "type") {
        return item.invoiceType.toLowerCase().includes(filterValue.toLowerCase());
      }
    });
  }

  for (let j = 0; j < results.length; j++) {
    let payment = await paymentModel.aggregate([
      { $match: { invoice: new mongoose.Types.ObjectId(results[j]._id) } },
      { $group: { _id: null, totalPaid: { $sum: "$amount" } } },
    ]);
    if (payment.length) {
      results[j].totalPaid = payment[0].totalPaid;
      results[j].amountDue = results[j].amount - payment[0].totalPaid;
    } else {
      results[j].totalPaid = 0;
      results[j].amountDue = results[j].amount;
    }
    console.log(payment, "payment");
    for (let i = 0; i < results[j].productLines.length; i++) {
      if (results[j].productLines[i].product) {
        results[j].productLines[i].total =
          results[j].productLines[i].qty *
          results[j].productLines[i].product.unitPrice;
      }
    }
  }
  let message = "";
  if (!ApiFeat ) {
    return res.status(404).json({
      message: "No Invoice was found!",
    });
  }

  for (let i = 0; i < results.length; i++) {
    if (results[i].amount < 0) {
      message = "amount must be greater than 0";
      return res.status(400).json({ message });
    }
    // if (results[i].amountDue < 0) {
    //   message = "amountDue must be greater than 0";
    //   return res.status(400).json({ message });
    // }
    // if (results[i].totalPaid < 0) {
    //   message = "total Paid must be greater than 0";
    //   return res.status(400).json({ message });
    // }
  }
  res.json({
    message: "done",
    page: ApiFeat.page,
    count: await invoiceModel.countDocuments({
      $or: [
        { createdBy: req.params.id },
        { pharmacy: req.params.id },
        { rep: req.params.id },
        { driver: req.params.id },
      ],
    }),
    results,
  });
});
const getAllInvoiceByAdmin = catchAsync(async (req, res, next) => {
  let ApiFeat = null;

  ApiFeat = new ApiFeature(
    invoiceModel
      .find()
      .populate("pharmacy productLines.product company createdBy rep driver"),
    req.query
  )
    .pagination()
    // .sort()
    .search(req.query.key);

  let results = await ApiFeat.mongooseQuery;
  results = JSON.stringify(results);
  results = JSON.parse(results);
  let { filterType, filterValue } = req.query;

  if (filterType && filterValue) {
    results = results.filter(function (item) {
      if (filterType == "pharmacy") {
        if(item.pharmacy){
          return item.pharmacy.name.toLowerCase().includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "company") {
        if(item.company){
          return item.company.name.toLowerCase().includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "createdBy") {
        if(item.createdBy){
          return item.createdBy.name.toLowerCase().includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "rep") {
        if(item.rep){
          return item.rep.name.toLowerCase().includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "date") {
        return item.date == filterValue;
      }
      if (filterType == "location") {
        if(item.pharmacy){
          return item.pharmacy.location.toLowerCase().includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "type") {
        return item.invoiceType.toLowerCase().includes(filterValue.toLowerCase());
      }
    });
  }

  for (let j = 0; j < results.length; j++) {
    for (let i = 0; i < results[j].productLines.length; i++) {
      if (results[j].productLines[i].product) {
        results[j].productLines[i].total =
          results[j].productLines[i].qty *
          results[j].productLines[i].product.unitPrice;
      }
    }
    // let totalAmt = 0;
    // for (let i = 0; i < results[j].payments.length; i++) {
    //   totalAmt += results[j].payments[i].amount;
    // }
    // results[j].totalPaid = totalAmt;
    // results[j].amountDue = results[j].amount - results[j].totalPaid;
  }

  if (!ApiFeat) {
    return res.status(404).json({
      message: "No Invoice was found!",
    });
  }

  for (let i = 0; i < results.length; i++) {
    if (results[i].amount < 0) {
      message = "amount must be greater than 0";
      return res.status(400).json({ message });
    }
    if (results[i].amountDue < 0) {
      message = "amountDue must be greater than 0";
      return res.status(400).json({ message });
    }
    if (results[i].totalPaid < 0) {
      message = "total Paid must be greater than 0";
      return res.status(400).json({ message });
    }

    // for (let index = 0; index < results[i].payments.length; index++) {
    //   if (results[index].payments[index].amount < 0) {
    //     return res
    //       .status(400)
    //       .json({ message: "amount must be greater than 0" });
    //   }
    // }
  }
  res.json({
    message: "done",
    page: ApiFeat.page,
    count: await invoiceModel.countDocuments(),
    results,
  });
  // count: await invoiceModel.countDocuments({ company: req.params.id }),
});

const getInvoiceById = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let results = await invoiceModel
    .findById(id)
    .populate("pharmacy productLines.product company createdBy rep driver");
  results = JSON.stringify(results);
  results = JSON.parse(results);

  if (!results) {
    return res.status(404).json({ message: "Invoice not found!" });
  }

  for (let i = 0; i < results.productLines.length; i++) {
    results.productLines[i].total =
      results.productLines[i].qty * results.productLines[i].product.unitPrice;
  }
  // if(payment.length){
  //   results[j].totalPaid = results[0].totalPaid
  //   results[j].amountDue = results[j].amount - results[0].totalPaid
  // }
  // else{
  //   results[j].totalPaid = 0;
  //   results[j].amountDue = results[j].amount
  // }
  for (let i = 0; i < results.length; i++) {
    if (results[i].amount < 0) {
      message = "amount must be greater than 0";
      return res.status(400).json({ message });
    }
    if (results[i].amountDue < 0) {
      message = "amount Due must be greater than 0";
      return res.status(400).json({ message });
    }
    if (results[i].totalPaid < 0) {
      message = "total Paid must be greater than 0";
      return res.status(400).json({ message });
    }

    // for (let index = 0; index < Invoice[i].payments.length; index++) {
    //   if (Invoice[index].payments[index].amount < 0) {
    //     return res
    //       .status(400)
    //       .json({ message: "amount must be greater than 0" });
    //   }
    // }
  }

  res.status(200).json({ results });
});
const getInvByUserId = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let Invoice = await invoiceModel
    .find({ createdBy: id })
    .populate("pharmacy productLines.product company createdBy rep driver");
  Invoice = JSON.stringify(Invoice);
  Invoice = JSON.parse(Invoice);

  if (!Invoice) {
    return res.status(404).json({ message: "Invoice not found!" });
  }

  for (let i = 0; i < Invoice.productLines.length; i++) {
    Invoice.productLines[i].total =
      Invoice.productLines[i].qty * Invoice.productLines[i].product.unitPrice;
  }
  // let totalAmt = 0;
  // for (let i = 0; i < Invoice.payments.length; i++) {
  //   totalAmt += Invoice.payments[i].amount;
  // }
  // Invoice.totalPaid = totalAmt;
  // Invoice.amountDue = Invoice.amount - Invoice.totalPaid;

  res.status(200).json({ Invoice });
});
const updateInvoice = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let addedInvoice = await invoiceModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (req.body.amount < 0) {
    let message = "amount must be greater than 0";
    return res.status(400).json({ message });
  }

  if (!addedInvoice) {
    return res.status(404).json({ message: "Couldn't update!  not found!" });
  }
  res
    .status(200)
    .json({ message: "Invoice updated successfully!", addedInvoice });
});
const deleteInovice = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let deletedInvoice = await invoiceModel.findByIdAndDelete({ _id: id });

  if (!deletedInvoice) {
    return res.status(404).json({ message: "Couldn't delete!  not found!" });
  }

  res.status(200).json({ message: "Invoice deleted successfully!" });
});

export {
  createInvoice,
  getAllInvoiceByUser,
  getInvoiceById,
  deleteInovice,
  updateInvoice,
  // createPhoto,
  addPhotos,
  getInvByUserId,
  createProductLines,
  deleteProductLines,
  getAllInvoiceByAdmin,
};
