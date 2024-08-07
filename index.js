import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http"
import { Server } from "socket.io";
const app = express();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});
import cors from "cors";
import dbConnection from "./database/DBConnection.js";
import { init } from "./src/modules/index.js";
import { globalError } from "./src/utils/middleWare/globalError.js";

app.use(express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

dbConnection();

init(app);

app.use(globalError);

app.listen(process.env.PORT || 8008, () =>
  console.log(`Server is running on port ${process.env.PORT || 8008}!`)
);
httpServer.listen(8002);
export const sio = io;
