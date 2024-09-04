import express from "express";
const usersRouter = express.Router();

import * as usersController from "./users.controller.js";
import { fileFilterHandler, fileSizeLimitErrorHandler, uploadMixFile } from "../../utils/middleWare/fileUploads.js";

usersRouter.get("/", usersController.getAllUsers);
usersRouter.get("/pharmacy", usersController.getAllPharm);
usersRouter.get("/rep", usersController.getAllRep);
usersRouter.get("/admin", usersController.getAllAdmin);
usersRouter.get("/supervisor", usersController.getAllSuper);
usersRouter.get("/driver", usersController.getAllDriver);
usersRouter.get("/sale", usersController.getAllSaleManger);
usersRouter.get("/acc", usersController.getAllAcc);
usersRouter.post("/", usersController.createUser);
usersRouter.post(
  "/photo",
  uploadMixFile("profilePic", [
    { name: "profilePic"},
  ]),fileFilterHandler,fileSizeLimitErrorHandler,
  usersController.addPhotos
);
usersRouter.get("/:id", usersController.getUserById);
usersRouter.get("/relations/:id", usersController.getUserRelations);
usersRouter.post("/relations/add/:id", usersController.addUserRelations);
usersRouter.put("/:id", usersController.updateUser);
usersRouter.delete("/:id", usersController.deleteUser);

export default usersRouter;
