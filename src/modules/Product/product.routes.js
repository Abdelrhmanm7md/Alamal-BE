import express from "express";
const productRouter = express.Router();

import * as productController from "./product.controller.js";

productRouter.get("/", productController.getAllProduct);
productRouter.get("/:productId", productController.getProductById);
productRouter.delete("/:id", productController.deleteProduct);
productRouter.put("/:id", productController.updateProduct);
productRouter.post("/", productController.createProduct);
productRouter.get("/search/:productName", productController.searchProduct);

export default productRouter;
