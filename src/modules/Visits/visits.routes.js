import express from "express";
import * as visitController from "./visits.controller.js";

const visitRouter = express.Router();

visitRouter.get("/", visitController.getAllVisits);
visitRouter.post("/", visitController.createVisit);
visitRouter.put("/", visitController.editVisit);
visitRouter.delete("/", visitController.deleteVisit);

export default visitRouter;
