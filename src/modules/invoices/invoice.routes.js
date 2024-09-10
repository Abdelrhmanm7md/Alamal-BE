import express from "express";
const invoiceRouter = express.Router();

import * as invoiceController from "./invoice.controller.js";
import { fileSizeLimitErrorHandler, uploadMixFile } from "../../utils/middleWare/fileUploads.js";

invoiceRouter.get("/user/:id", invoiceController.getAllInvoiceByUser);
invoiceRouter.get("/", invoiceController.getAllInvoiceByAdmin);
invoiceRouter.get("/admin", invoiceController.getAllInvoiceByAdminWithoutPagination);
// invoiceRouter.get("/:id", invoiceController.getInvoiceById);
invoiceRouter.get("/:id", invoiceController.getInvByUserId);
invoiceRouter.post("/product/:id", invoiceController.createProductLines);
invoiceRouter.delete("/:invId/line/:lineId", invoiceController.deleteProductLines);
invoiceRouter.delete("/:id", invoiceController.deleteInovice);
invoiceRouter.put("/:id", invoiceController.updateInvoice);
invoiceRouter.post("/", invoiceController.createInvoice);
invoiceRouter.post(
  "/photo",
  uploadMixFile("invoices", [
    { name: "image", maxCount: 1},
  ]),fileSizeLimitErrorHandler,
  invoiceController.addPhotos
);

export default invoiceRouter;
