import express from "express";
const productRouter = express.Router();

import * as productController from "./product.controller.js";
import { uploadSingleFile } from "../../utils/middleWare/fileUploads.js";

productRouter.get("/", productController.getAllProductByAdmin);
productRouter.get(
  "/user/:id",
  productController.getAllProductByCompanyWithPagination
);
productRouter.get(
  "/line/:id",
  productController.getAllProductByCompanyWithoutPagination
);
productRouter.get("/invoice/:id", productController.getProductlineById);
productRouter.get("/:id", productController.getProductById);
productRouter.delete("/:id", productController.deleteProduct);
productRouter.put("/:id", productController.updateProduct);
productRouter.post("/", productController.createProduct);
productRouter.post(
  "/photo",
  uploadSingleFile("photo", "pic"),
  productController.createPhoto
);

export default productRouter;
