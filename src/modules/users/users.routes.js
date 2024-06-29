import express from "express";
const usersRouter = express.Router();

import * as usersController from "./users.controller.js";

usersRouter.get("/", usersController.getAllUsers);
usersRouter.get("/pharm", usersController.getAllPharm);
usersRouter.get("/rep", usersController.getAllRep);
usersRouter.get("/admin", usersController.getAllAdmin);
usersRouter.get("/supervisor", usersController.getAllSuper);
usersRouter.get("/driver", usersController.getAllDriver);
usersRouter.get("/sale", usersController.getAllSaleManger);
usersRouter.get("/acc", usersController.getAllAcc);
usersRouter.post("/", usersController.createUser);
usersRouter.get("/:id", usersController.getUserById);
usersRouter.put("/:id", usersController.updateUser);
usersRouter.delete("/:id", usersController.deleteUser);

export default usersRouter;
