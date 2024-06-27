import express from "express";
import * as photoController from "./photo.controller.js";
import { uploadSingleFile } from "../../utils/middleWare/fileUploads.js";

const photoRouter = express.Router();

photoRouter.post(
  "/",
  uploadSingleFile("photo", "image"),
  photoController.createIamge
);
photoRouter.post(
  "/",
  uploadSingleFile("photo", "image"),
  photoController.createIamge
);
photoRouter.get("/", photoController.getAllIamge);
photoRouter.put("/:id", photoController.editIamge);
photoRouter.delete("/:id", photoController.deleteIamge);

export default photoRouter;
