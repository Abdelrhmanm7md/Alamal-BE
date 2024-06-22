import express from "express";
const paymentRouter = express.Router();

import * as paymentController from "./payment.controller.js";

paymentRouter.get("/", paymentController.getAllpayment);
paymentRouter.get("/:paymentId", paymentController.getpaymentById);
paymentRouter.post(
  "/",
  paymentController.createpayment
);
paymentRouter.get("/search/:payment", paymentController.searchpayment);
paymentRouter.put("/", paymentController.updatePayment);
paymentRouter.delete("/", paymentController.deletePayment);

export default paymentRouter;
