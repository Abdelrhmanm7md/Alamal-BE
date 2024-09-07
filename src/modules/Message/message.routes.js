import express from "express";
import * as messageController from "./message.controller.js";

const messageRouter = express.Router();

messageRouter.post("/", messageController.createmessage);
messageRouter.get("/", messageController.getAllmessageBySenderOrReciever);


export default messageRouter;
