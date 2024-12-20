import mongoose from "mongoose";
import { returnInvoiceModel } from "../../../database/models/returnInvoice.model.js";
import { paymentModel } from "../../../database/models/payments.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";
import path from "path";
import fsExtra from "fs-extra";
const createReturnInvoice = catchAsync(async (req, res, next) => {
  var message = "";
  let newReturnInvoice = new returnInvoiceModel(req.body);
  if (req.body.amount < 0) {
    message = "amount must be greater than 0";
    return res.status(400).json({ message });
  }

  let addedReturnInvoice = await newReturnInvoice.save();
  addedReturnInvoice.productLines.map((element) => {
    element.ReturnInvoiceId = addedReturnInvoice._id;
  });

  res.status(201).json({
    message: "ReturnInvoice has been created successfully!",
    addedReturnInvoice,
  });
});
const createProductLines = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let addedProductLine = await returnInvoiceModel
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
  let { invId, lineId } = req.params;

  let deletedReturnInvoice = await returnInvoiceModel.findOneAndUpdate(
    { _id: invId },
    { $pull: { productLines: { _id: lineId } } },
    false,
    true
  );

  if (!deletedReturnInvoice) {
    return res.status(404).json({ message: "Couldn't delete!  not found!" });
  }

  res.status(201).json({
    message: "product lines has been deleted successfully!",
    deletedReturnInvoice,
  });
});

const addPhotos = catchAsync(async (req, res, next) => {
  let image = "";
  req.body.image =
    req.files.image &&
    req.files.image.map(
      (file) =>
        `${process.env.BASE_URL}returnReturnInvoices/${file.filename.split(" ").join("")}`
    );

  const directoryPath = path.join(image, "uploads/returnReturnInvoices");

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

const getAllReturnInvoiceByUser= catchAsync(async (req, res, next) => {
  let ApiFeat = null;
  if (req.params.id) {
    ApiFeat = new ApiFeature(
      returnInvoiceModel
        .find({ $or: [{ rep: req.params.id },{ createdBy: req.params.id }] }, )
        .populate("createdBy rep productLines.product company"),
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
        if (item.pharmacy) {
          return item.pharmacy.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "company") {
        if (item.company) {
          return item.company.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "createdBy") {
        if (item.createdBy) {
          return item.createdBy.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "rep") {
        if (item.rep) {
          return item.rep.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "date") {
        return item.date == filterValue;
      }
      if (filterType == "location") {
        if (item.pharmacy) {
          return item.pharmacy.location
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "type") {
        return item.ReturnInvoiceType
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }
    });
  }

  for (let j = 0; j < results.length; j++) {
    let payment = await paymentModel.aggregate([
      { $match: { ReturnInvoice: new mongoose.Types.ObjectId(results[j]._id) } },
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
  if (!ApiFeat) {
    return res.status(404).json({
      message: "No ReturnInvoice was found!",
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
    message: "Done",
    page: ApiFeat.page,
    count: await returnInvoiceModel.countDocuments({
      $or: [
        { createdBy: req.params.id },
        { rep: req.params.id },
        { driver: req.params.id },
      ],
    }),
    results,
  });
});
const getAllReturnInvoiceByAdmin = catchAsync(async (req, res, next) => {
  let ApiFeat = null;

  ApiFeat = new ApiFeature(
    returnInvoiceModel
      .find()
      .populate("productLines.product company createdBy rep driver"),
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
        if (item.pharmacy) {
          return item.pharmacy.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "company") {
        if (item.company) {
          return item.company.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "createdBy") {
        if (item.createdBy) {
          return item.createdBy.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "rep") {
        if (item.rep) {
          return item.rep.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
      if (filterType == "date") {
        return item.date == filterValue;
      }
      if (filterType == "location") {
        if (item.pharmacy) {
          return item.pharmacy.location
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
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

    let payment = await paymentModel.aggregate([
      { $match: { ReturnInvoice: new mongoose.Types.ObjectId(results[j]._id) } },
      { $group: { _id: null, totalPaid: { $sum: "$amount" } } },
    ]);
    if (payment.length) {
      results[j].totalPaid = payment[0].totalPaid;
      results[j].amountDue = results[j].amount - payment[0].totalPaid;
    } else {
      results[j].totalPaid = 0;
      results[j].amountDue = results[j].amount;
    }
  }

  if (!ApiFeat) {
    return res.status(404).json({
      message: "No ReturnInvoice was found!",
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
  }
  res.json({
    message: "Done",
    page: ApiFeat.page,
    count: await returnInvoiceModel.countDocuments(),
    results,
  });
});
const getAllReturnInvoiceByAdminWithoutPagination = catchAsync(
  async (req, res, next) => {
    let ApiFeat = null;

    ApiFeat = new ApiFeature(
      returnInvoiceModel
        .find()
        .populate("productLines.product company createdBy rep driver"),
      req.query
    )
      // .sort()
      .search(req.query.key);

    let results = await ApiFeat.mongooseQuery;
    results = JSON.stringify(results);
    results = JSON.parse(results);
    let { filterType, filterValue } = req.query;

    if (filterType && filterValue) {
      results = results.filter(function (item) {
        if (filterType == "pharmacy") {
          if (item.pharmacy) {
            return item.pharmacy.name
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          }
        }
        if (filterType == "company") {
          if (item.company) {
            return item.company.name
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          }
        }
        if (filterType == "createdBy") {
          if (item.createdBy) {
            return item.createdBy.name
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          }
        }
        if (filterType == "rep") {
          if (item.rep) {
            return item.rep.name
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          }
        }
        if (filterType == "date") {
          return item.date == filterValue;
        }
        if (filterType == "location") {
          if (item.pharmacy) {
            return item.pharmacy.location
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          }
        }
        if (filterType == "type") {
          return item.ReturnInvoiceType
            .toLowerCase()
            .includes(filterValue.toLowerCase());
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

      let payment = await paymentModel.aggregate([
        { $match: { ReturnInvoice: new mongoose.Types.ObjectId(results[j]._id) } },
        { $group: { _id: null, totalPaid: { $sum: "$amount" } } },
      ]);
      if (payment.length) {
        results[j].totalPaid = payment[0].totalPaid;
        results[j].amountDue = results[j].amount - payment[0].totalPaid;
      } else {
        results[j].totalPaid = 0;
        results[j].amountDue = results[j].amount;
      }
    }

    if (!ApiFeat) {
      return res.status(404).json({
        message: "No ReturnInvoice was found!",
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
    }
    res.json({
      message: "Done",
      count: await returnInvoiceModel.countDocuments(),
      results,
    });
  }
);

const getReturnInvoiceById = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let results = await returnInvoiceModel
    .findById(id)
    .populate("productLines.product company createdBy rep driver");
  results = JSON.stringify(results);
  results = JSON.parse(results);

  if (!results) {
    return res.status(404).json({ message: "ReturnInvoice not found!" });
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

    // for (let index = 0; index < ReturnInvoice[i].payments.length; index++) {
    //   if (ReturnInvoice[index].payments[index].amount < 0) {
    //     return res
    //       .status(400)
    //       .json({ message: "amount must be greater than 0" });
    //   }
    // }
  }

  res.status(200).json({ results });
});
// const getInvByUserId = catchAsync(async (req, res, next) => {
//   let { id } = req.params;

//   let ReturnInvoice = await returnInvoiceModel
//     .find({ createdBy: id })
//     .populate("productLines.product company createdBy rep driver");
//   ReturnInvoice = JSON.stringify(ReturnInvoice);
//   ReturnInvoice = JSON.parse(ReturnInvoice);

//   if (!ReturnInvoice) {
//     return res.status(404).json({ message: "Return Invoice not found!" });
//   }

//   for (let i = 0; i < ReturnInvoice.productLines.length; i++) {
//     ReturnInvoice.productLines[i].total =
//       ReturnInvoice.productLines[i].qty * ReturnInvoice.productLines[i].product.unitPrice;
//   }
//   // let totalAmt = 0;
//   // for (let i = 0; i < ReturnInvoice.payments.length; i++) {
//   //   totalAmt += ReturnInvoice.payments[i].amount;
//   // }
//   // ReturnInvoice.totalPaid = totalAmt;
//   // ReturnInvoice.amountDue = ReturnInvoice.amount - ReturnInvoice.totalPaid;

//   res.status(200).json({ ReturnInvoice });
// });
const updateReturnInvoice = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let addedReturnInvoice = await returnInvoiceModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (req.body.amount < 0) {
    let message = "amount must be greater than 0";
    return res.status(400).json({ message });
  }

  if (!addedReturnInvoice) {
    return res.status(404).json({ message: "Couldn't update!  not found!" });
  }
  res
    .status(200)
    .json({ message: "Return Invoice updated successfully!", addedReturnInvoice });
});
const deleteReturnInvoice = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let deletedReturnInvoice = await returnInvoiceModel.findByIdAndDelete({ _id: id });

  if (!deletedReturnInvoice) {
    return res.status(404).json({ message: "Couldn't delete!  not found!" });
  }

  res.status(200).json({ message: "Return Invoice deleted successfully!" });
});

export {
  createReturnInvoice,
  getAllReturnInvoiceByUser,
  getAllReturnInvoiceByAdmin,
  deleteReturnInvoice,
  updateReturnInvoice,
  addPhotos,
  // getInvByUserId,
  createProductLines,
  deleteProductLines,
  getAllReturnInvoiceByAdminWithoutPagination,
  getReturnInvoiceById,
};
