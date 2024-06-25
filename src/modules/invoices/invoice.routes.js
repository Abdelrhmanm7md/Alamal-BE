import express from "express";
const invoiceRouter = express.Router();

import * as invoiceController from "./invoice.controller.js";
import { uploadMixFile, uploadSingleFile } from "../../utils/middleWare/fileUploads.js";

invoiceRouter.get("/", invoiceController.getAllInvoice);
invoiceRouter.get("/:id", invoiceController.getInvoiceById);
invoiceRouter.delete("/:id", invoiceController.deleteInovice);
invoiceRouter.put("/:id", invoiceController.updateInvoice);
invoiceRouter.post("/", invoiceController.createInvoice);
invoiceRouter.post(
  "/photo/:id",
  uploadSingleFile("invoices", "image"),
  // uploadMixFile("/invoices", [{name:"image",maxCount:1}]),
  invoiceController.createPhoto
);
invoiceRouter.get("/search/:invoiceName", invoiceController.searchInvoice);

export default invoiceRouter;
