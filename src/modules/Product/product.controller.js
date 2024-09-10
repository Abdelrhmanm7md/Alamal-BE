import { invoiceModel } from "../../../database/models/invoice.model.js";
import { productModel } from "../../../database/models/product.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";
import path from "path";
import fsExtra from "fs-extra";
const createProduct = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const existingDocument = await productModel.findOne({ name: {$regex: name, $options: 'i'}  });

  if (existingDocument) {
    return res.status(400).json({ message: 'Name must be unique' });
  }
    let newProduct = new productModel(req.body);
    let addedProduct = await newProduct.save();
    res.status(201).json({
      message: "Product has been created successfully!",
      addedProduct,
    });
});

const addPhotos = catchAsync(async (req, res, next) => {
  let pic = "";
  req.body.pic =
    req.files.pic &&
    req.files.pic.map(
      (file) =>
        `${process.env.BASE_URL}Product/${file.filename.split(" ").join("")}`
    );

  const directoryPath = path.join(pic, "uploads/Product");

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

  if (req.body.pic) {
    pic = req.body.pic;
  }
  if (pic !== "") {
    pic = pic[0];
    res.status(200).json({
      message: "Photo created successfully!",
      pic,
    });
  } else {
    res.status(400).json({ message: "File upload failed." });
  }
});

const getAllProductByAdmin = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(
    productModel.find().populate("company"),
    req.query
  )
    .pagination()
    .sort()
    .search(req.query.key)
    .fields();

  let results = await ApiFeat.mongooseQuery;
  results = JSON.stringify(results);
  results = JSON.parse(results);

  if (!ApiFeat || !results) {
    return res.status(404).json({
      message: "No Product was found!",
    });
  }
  let { filterType, filterValue } = req.query;
  if (filterType && filterValue) {
    results = results.filter(function (item) {
      if (filterType == "productName") {
        return item.name.toLowerCase().includes(filterValue.toLowerCase());
      }
      if (filterType == "company") {
        if (item.company) {
          return item.company.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
    });
  }
  res.json({
    message: "Done",
    page: ApiFeat.page,
    count: await productModel.countDocuments(),
    results,
  });
});
const getAllProductByAdminWithoutPagination = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(
    productModel.find().populate("company"),
    req.query
  )
    .sort()
    .search(req.query.key)
    .fields();

  let results = await ApiFeat.mongooseQuery;
  results = JSON.stringify(results);
  results = JSON.parse(results);

  if (!ApiFeat || !results) {
    return res.status(404).json({
      message: "No Product was found!",
    });
  }
  let { filterType, filterValue } = req.query;
  if (filterType && filterValue) {
    results = results.filter(function (item) {
      if (filterType == "productName") {
        return item.name.toLowerCase().includes(filterValue.toLowerCase());
      }
      if (filterType == "company") {
        if (item.company) {
          return item.company.name
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      }
    });
  }
  res.json({
    message: "Done",
    count: await productModel.countDocuments(),
    results,
  });
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
        if (filterType == "productName") {
          return item.name.toLowerCase().includes(filterValue.toLowerCase());
        }
        if (filterType == "company") {
          if (item.company) {
            return item.company.name
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          }
        }
      });
    }
    res.json({
      message: "Done",
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
        if (filterType == "productName") {
          return item.name.toLowerCase().includes(filterValue.toLowerCase());
        }
        if (filterType == "company") {
          if (item.company) {
            return item.company.name
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          }
        }
      });
    }
    res.json({
      message: "Done",
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

  let results = await invoiceModel.findById(id);

  if (!results) {
    return res.status(404).json({ message: "Product not found!" });
  }
  results = results.productLines;

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
  // createPhoto,
  addPhotos,
  getAllProductByCompanyWithPagination,
  getAllProductByCompanyWithoutPagination,
  getProductlineById,
  getAllProductByAdminWithoutPagination,
};
