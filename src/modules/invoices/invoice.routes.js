import express from "express";
const invoiceRouter = express.Router();

import * as invoiceController from "./invoice.controller.js";
import { uploadSingleFile } from "../../utils/middleWare/fileUploads.js";

invoiceRouter.get("/user/:id", invoiceController.getAllInvoiceByUser);
invoiceRouter.get("/", invoiceController.getAllInvoiceByAdmin);
invoiceRouter.get("/:id", invoiceController.getInvoiceById);
invoiceRouter.get("/:id", invoiceController.getInvByUserId);
invoiceRouter.post("/product/:id", invoiceController.createProductLines);
invoiceRouter.delete("/line/:id", invoiceController.deleteProductLines);
invoiceRouter.delete("/:id", invoiceController.deleteInovice);
invoiceRouter.put("/:id", invoiceController.updateInvoice);
invoiceRouter.post("/", invoiceController.createInvoice);
invoiceRouter.post(
  "/photo",
  uploadSingleFile("invoices", "image"),
  invoiceController.createPhoto
);

export default invoiceRouter;
