import express from "express";
import * as visitController from "./visits.controller.js";

const visitRouter = express.Router();

visitRouter.get("/", visitController.getAllVisits);
visitRouter.get("/user/:id", visitController.getAllVisits);
visitRouter.post("/", visitController.createVisit);
visitRouter.put("/:id", visitController.editVisit);
visitRouter.delete("/:id", visitController.deleteVisit);

export default visitRouter;
