import express from "express";
import * as companyController from "./company.controller.js";

const companyRouter = express.Router();

companyRouter.post("/", companyController.createCompany);
companyRouter.get("/", companyController.getAllCompany);
companyRouter.put("/:id", companyController.editCompany);
companyRouter.delete("/:id", companyController.deleteCompany);

export default companyRouter;
