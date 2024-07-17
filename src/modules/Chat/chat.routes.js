import express from "express";
import * as companyController from "./chat.controller.js";
import { fileSizeLimitErrorHandler, uploadMixFile, uploadSingleFile } from "../../utils/middleWare/fileUploads.js";

const companyRouter = express.Router();

companyRouter.post("/", companyController.createCompany);
companyRouter.get("/", companyController.getAllCompany);
companyRouter.get("/user/:id", companyController.getAllCompany);
companyRouter.put("/:id", companyController.editCompany);
companyRouter.delete("/:id", companyController.deleteCompany);
companyRouter.post(
  "/photo",
    uploadMixFile("photo", [
    { name: "logo", maxCount: 1},
  ]),fileSizeLimitErrorHandler,
  companyController.addPhotos
);

export default companyRouter;
