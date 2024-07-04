import express from "express";
const invoiceRouter = express.Router();

import * as invoiceController from "./invoice.controller.js";
import { uploadSingleFile } from "../../utils/middleWare/fileUploads.js";

invoiceRouter.get("/", invoiceController.getAllInvoice);
invoiceRouter.get("/user/:id", invoiceController.getAllInvoice);
invoiceRouter.get("/:id", invoiceController.getInvoiceById);
invoiceRouter.get("/:id", invoiceController.getInvByUserId);
invoiceRouter.post("/product/:id", invoiceController.createProductLines);
invoiceRouter.delete("/:id", invoiceController.deleteInovice);
invoiceRouter.delete("/line/:id", invoiceController.deleteProductLines);
invoiceRouter.put("/:id", invoiceController.updateInvoice);
invoiceRouter.post("/", invoiceController.createInvoice);
invoiceRouter.post(
  "/photo",
  uploadSingleFile("invoices", "image"),
  invoiceController.createPhoto
);
// invoiceRouter.get("/search/:invoiceName", invoiceController.searchInvoice);

export default invoiceRouter;
