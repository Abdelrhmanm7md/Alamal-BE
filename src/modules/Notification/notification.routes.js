import express from "express";
import * as notiticationController from "./notification.controller.js";

const notiticationRouter = express.Router();

notiticationRouter.get("/", notiticationController.getAllNotification);
notiticationRouter.post("/", notiticationController.createNotification);
notiticationRouter.delete("/", notiticationController.deleteNotification);

export default notiticationRouter;
