import express, { type Express } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import { ApiError, errorHandler } from "./lib/utils";
import { Server } from "socket.io";
import { adminrouter } from "./routes/admin";

dotenv.config();
const apiVersion = "/api/v1";

const app: Express = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: `${process.env.NODE_ENV === "development" ? "http" : "https"}://${
      process.env.CLIENT_DOMAIN
    }`,
    credentials: true,
  },
});

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

app.use(`${apiVersion}/admin`, adminrouter);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.all("*", (req, res, next) => {
  next(new ApiError(`Routes does not exist`, 404));
});

app.use(errorHandler);

export { server };
