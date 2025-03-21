import express, { type Express } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { ApiError, errorHandler } from "./lib/utils";

dotenv.config();

const app: Express = express();

const apiVersion = "/api/v1";

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.NODE_ENV === "development" ? "http" : "https"}://${
      process.env.CLIENT_DOMAIN
    }`,
    credentials: true,
  })
);

app.enable("trust proxy");
app.get("/", (req, res) => {
  res.send({ status: "Success", message: "Server is running" });
});
// router heres

app.all("*", (req, res, next) => {
  next(new ApiError(`Routes does not exist`, 404));
});

app.use(errorHandler);

export { app };
