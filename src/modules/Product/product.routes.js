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
  productController.createProduct
);
productRouter.post(
  "/photo",
  uploadSingleFile("photo", "pic"),
  productController.createPhoto
);
productRouter.get("/search/:productName", productController.searchProduct);

export default productRouter;
