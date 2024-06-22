import express from "express";
import * as transController from "./trans.controller.js";

const transRouter = express.Router();

transRouter.post("/", transController.createTrans);
transRouter.get("/", transController.getAllTrans);
transRouter.put("/", transController.editTrans);
transRouter.delete("/", transController.deleteTrans);

export default transRouter;
