import express from "express";
const usersRouter = express.Router();

import * as usersController from "./users.controller.js";

usersRouter.get("/", usersController.getAllUsers);
usersRouter.post("/", usersController.createUser);
usersRouter.get("/:id", usersController.getUserById);
usersRouter.put("/", usersController.updateUser);
usersRouter.delete("/", usersController.deleteUser);

export default usersRouter;
