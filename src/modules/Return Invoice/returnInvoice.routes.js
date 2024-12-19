import express from "express";
const returnInvoiceRouter = express.Router();

import * as returnInvoiceController from "./returnInvoice.controller.js";
import {
  fileSizeLimitErrorHandler,
  uploadMixFile,
} from "../../utils/middleWare/fileUploads.js";

returnInvoiceRouter.get("/user/:id",returnInvoiceController.getAllReturnInvoiceByUser);
returnInvoiceRouter.get("/",returnInvoiceController.getAllReturnInvoiceByAdmin);
returnInvoiceRouter.get("/admin",returnInvoiceController.getAllReturnInvoiceByAdminWithoutPagination);
// returnInvoiceRouter.get("/user/:id", returnInvoiceController.getInvByUserId);
returnInvoiceRouter.get("/:id", returnInvoiceController.getReturnInvoiceById);

returnInvoiceRouter.put("/:id", returnInvoiceController.updateReturnInvoice);


returnInvoiceRouter.post("/", returnInvoiceController.createReturnInvoice);
returnInvoiceRouter.post(
  "/photo",uploadMixFile("returnInvoices", [{ name: "image", maxCount: 1 }]),fileSizeLimitErrorHandler,returnInvoiceController.addPhotos
);
returnInvoiceRouter.post("/product/:id",returnInvoiceController.createProductLines);

returnInvoiceRouter.delete("/:invId/line/:lineId",returnInvoiceController.deleteProductLines);
returnInvoiceRouter.delete("/:id", returnInvoiceController.deleteReturnInvoice);

export default returnInvoiceRouter;
