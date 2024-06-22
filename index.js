import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import cors from "cors";
import dbConnection from "./database/DBConnection.js";
import { init } from "./src/modules/index.js";
app.use(express.static("uploads"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

dbConnection();

init(app);
app.use((err, req, res, next) => {
  res
    .status(err.statusCode)
    .json({ message: err.message, statusCode: err.statusCode });
});
app.listen(process.env.PORT || 8000, () =>
  console.log(`Server is running on port ${process.env.PORT || 8000}!`)
);
