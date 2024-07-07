import express from "express";
import * as transController from "./trans.controller.js";

const transRouter = express.Router();

transRouter.post("/", transController.createTrans);
transRouter.get("/", transController.getAllTransByAdmin);
transRouter.get("/user/:id", transController.getAllTransByUser);
transRouter.put("/:id", transController.editTrans);
transRouter.delete("/:id", transController.deleteTrans);

export default transRouter;
