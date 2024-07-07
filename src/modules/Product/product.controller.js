import { invoiceModel } from "../../../database/models/invoice.model.js";
import { productModel } from "../../../database/models/product.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";

const createProduct = catchAsync(async (req, res, next) => {
  console.log(req.files, "req.files");
  let newProduct = new productModel(req.body);
  let addedProduct = await newProduct.save();

  res.status(201).json({
    message: "Product has been created successfully!",
    addedProduct,
  });
});
const createPhoto = catchAsync(async (req, res, next) => {
  if (req.file) req.body.pic = req.file.filename;
  let pic = "";
  if (req.body.pic) {
    pic = req.body.pic;
  }

  if (!req.body.pic) {
    return res.status(404).json({ message: "Couldn't update!  not found!" });
  }
  res.status(200).json({
    message: "Photo updated successfully!",
    pic: `${process.env.BASE_URL}invoices/${pic}`,
  });
});

const getAllProductByAdmin = catchAsync(async (req, res, next) => {
  let ApiFeat = null;

  ApiFeat = new ApiFeature(productModel.find().populate("company"), req.query)
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
      if (filterType == "name") {
        return item.name.toLowerCase().includes(filterValue);
      }
      if (filterType == "company") {
        return item.company.name.toLowerCase().includes(filterValue);
      }
    });
  }
  res.json({
    message: "done",
    page: ApiFeat.page,
    count: await productModel.countDocuments(),
    results,
  });
  if (!ApiFeat) {
    return res.status(404).json({
      message: "No Product was found!",
    });
  }
});
const getAllProductByCompanyWithoutPagination = catchAsync(
  async (req, res, next) => {
    let ApiFeat = null;
    if (req.params.id) {
      ApiFeat = new ApiFeature(
        productModel.find({ company: req.params.id }).populate("company"),
        req.query
      );
    }
    let results = await ApiFeat.mongooseQuery;
    results = JSON.stringify(results);
    results = JSON.parse(results);

    let { filterType, filterValue } = req.query;
    if (filterType && filterValue) {
      results = results.filter(function (item) {
        if (filterType == "name") {
          return item.name.toLowerCase().includes(filterValue);
        }
        if (filterType == "company") {
          return item.company.name.toLowerCase().includes(filterValue);
        }
      });
    }
    res.json({
      message: "done",
      page: ApiFeat.page,
      count: await productModel.countDocuments({ company: req.params.id }),
      results,
    });
    if (!ApiFeat) {
      return res.status(404).json({
        message: "No Product was found!",
      });
    }
  }
);
const getAllProductByCompanyWithPagination = catchAsync(
  async (req, res, next) => {
    let ApiFeat = null;
    if (req.params.id) {
      ApiFeat = new ApiFeature(
        productModel.find({ company: req.params.id }).populate("company"),
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
        if (filterType == "name") {
          return item.name.toLowerCase().includes(filterValue);
        }
        if (filterType == "company") {
          return item.company.name.toLowerCase().includes(filterValue);
        }
      });
    }
    res.json({
      message: "done",
      page: ApiFeat.page,
      count: await productModel.countDocuments({ company: req.params.id }),
      results,
    });
    if (!ApiFeat) {
      return res.status(404).json({
        message: "No Product was found!",
      });
    }
  }
);

const getProductById = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let results = await productModel.findById(id);

  if (!results) {
    return res.status(404).json({ message: "Product not found!" });
  }

  res.status(200).json({ results });
});
const getProductlineById = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  if (!id) {
    return res.status(404).json({ message: "invoice not found!" });
  }

  let results = await invoiceModel.find({ _id: id });

  if (!results) {
    return res.status(404).json({ message: "Product not found!" });
  }

  res.status(200).json({
    message: "Done",
    count: await productModel.countDocuments({
      _id: id,
    }),
    results,
  });
});
const updateProduct = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let updatedProduct = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedProduct) {
    return res.status(404).json({ message: "Couldn't update!  not found!" });
  }

  res
    .status(200)
    .json({ message: "Product updated successfully!", updatedProduct });
});
const deleteProduct = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  let productLines = await invoiceModel.find({
    productLines: { $elemMatch: { product: id } },
  });
  if (productLines && productLines.length > 0) {
    return res
      .status(403)
      .json({ message: "Couldn't delete! already in use " });
  } else {
    let deletedProduct = await productModel.findByIdAndDelete({ _id: id });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Couldn't delete!  not found!" });
    }

    res.status(200).json({ message: "Product deleted successfully!" });
  }
});

export {
  createProduct,
  getAllProductByAdmin,
  getProductById,
  deleteProduct,
  updateProduct,
  createPhoto,
  getAllProductByCompanyWithPagination,
  getAllProductByCompanyWithoutPagination,
  getProductlineById,
};
