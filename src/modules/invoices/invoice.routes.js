import express from "express";
const invoiceRouter = express.Router();

import * as invoiceController from "./invoice.controller.js";

invoiceRouter.get("/", invoiceController.getAllInvoice);
invoiceRouter.get("/:invoiceId", invoiceController.getInvoiceById);
invoiceRouter.delete("/:id", invoiceController.deleteInovice);
invoiceRouter.put("/:id", invoiceController.updateInvoice);
invoiceRouter.post("/", invoiceController.createInvoice);
invoiceRouter.get("/search/:invoiceName", invoiceController.searchInvoice);

export default invoiceRouter;
