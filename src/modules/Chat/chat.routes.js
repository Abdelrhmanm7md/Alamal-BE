import express from "express";
import * as chatController from "./chat.controller.js";

const chatRouter = express.Router();

chatRouter.post("/", chatController.createChat);
chatRouter.put("/:id", chatController.pushMessage);
chatRouter.get("/", chatController.getAllChatByAdmin);
chatRouter.get("/:id", chatController.getChat);


export default chatRouter;
