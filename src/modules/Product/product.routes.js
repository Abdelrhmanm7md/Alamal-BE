import express from "express";
const productRouter = express.Router();

import * as productController from "./product.controller.js";
import { uploadSingleFile } from "../../utils/middleWare/fileUploads.js";

productRouter.get("/", productController.getAllProduct);
productRouter.get("/:id", productController.getProductById);
productRouter.delete("/:id", productController.deleteProduct);
productRouter.put("/:id", productController.updateProduct);
productRouter.post(
  "/",
  uploadSingleFile("Product", "pic"),
  productController.createProduct
);
productRouter.get("/search/:productName", productController.searchProduct);

export default productRouter;
