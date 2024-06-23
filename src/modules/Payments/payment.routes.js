import express from "express";
const paymentRouter = express.Router();

import * as paymentController from "./payment.controller.js";

paymentRouter.get("/", paymentController.getAllpayment);
paymentRouter.get("/:id", paymentController.getpaymentById);
paymentRouter.post(
  "/",
  paymentController.createpayment
);
paymentRouter.get("/search/:payment", paymentController.searchpayment);
paymentRouter.put("/:id", paymentController.updatePayment);
paymentRouter.delete("/:id", paymentController.deletePayment);

export default paymentRouter;
