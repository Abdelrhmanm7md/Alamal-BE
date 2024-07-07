import express from "express";
const paymentRouter = express.Router();

import * as paymentController from "./payment.controller.js";

paymentRouter.get("/", paymentController.getAllpaymentByAdmin);
paymentRouter.get("/user/:id", paymentController.getAllpaymentByUser);
paymentRouter.get("/invoice/:id", paymentController.getAllpaymentByInvoice);
paymentRouter.post("/", paymentController.createpayment);
paymentRouter.put("/:id", paymentController.updatePayment);
paymentRouter.delete("/:id", paymentController.deletePayment);

export default paymentRouter;
