import { productModel } from "../../../database/models/product.model.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";



const createProduct = catchAsync(
  async (req, res, next) => {
    // req.body.pic = req.file.filename;
    console.log(req.files, "req.files");
  let newProduct = new productModel(req.body);
  let addedProduct = await newProduct.save();

  res.status(201).json({
    message: "Product has been created successfully!",
    addedProduct,
  });
});
const createPhoto = catchAsync(async (req, res, next) => {
  // console.log(req, "ddddd");

  if (req.file) req.body.pic = req.file.filename;
  let pic = "";
  if (req.body.pic) {
    pic = req.body.pic;
  }

  if (!req.body.pic) {
    return res.status(404).json({ message: "Couldn't update!  not found!" });
  }
  res
    .status(200)
    .json({ message: "Photo updated successfully!",pic: `${process.env.BASE_URL}invoices/${pic}` });
});

const getAllProduct = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(productModel.find(), req.query)
    .pagination()
    .sort()
    .search()
    .fields();

  let results = await ApiFeat.mongooseQuery;
  res.json({ message: "done", page: ApiFeat.page, results });
  if (!ApiFeat) {
    return res.status(404).json({
      message: "No Product was found!",
    });
  }
});

const searchProduct = catchAsync(async (req, res, next) => {
  let { ProductTitle, filterType, filterValue } = req.params;
  const page = req.query.p - 1 || 0;
  let Product = null;
  if (req.query.filter) {
    switch (filterType) {
      case "user":
        await productModel.find({
          id: { $regex: `${filterValue}`, $options: "i" },
        });
        break;
      case "loc":
        await productModel.find({
          id: { $regex: `${filterValue}`, $options: "i" },
        });
        break;
    }
  }
  if (!Product) {
    return res.status(404).json({
      message: "No Product was found!",
      
    });
  }

  res.status(200).json({ Product });
});

const getProductById = catchAsync(async (req, res, next) => {
  let { id } = req.params;

  let Product = await productModel.findById(id);

  if (!Product) {
    return res.status(404).json({ message: "Product not found!" });
  }

  res.status(200).json({ Product });
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

  let deletedProduct = await productModel.findByIdAndDelete({ _id: id });

  if (!deletedProduct) {
    return res.status(404).json({ message: "Couldn't delete!  not found!" });
  }

  res.status(200).json({ message: "Product deleted successfully!" });
});

export {
  createProduct,
  getAllProduct,
  searchProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  createPhoto
};
