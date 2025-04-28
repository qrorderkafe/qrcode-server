import express, { type Express } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import { ApiError, errorHandler } from "./lib/utils";
import { Server } from "socket.io";
import { adminrouter } from "./routes/admin";
import { menuRouter } from "./routes/menu";
import { tableRouter } from "./routes/table";
import { orderRouter } from "./routes/order";
import { initSocketIO } from "./lib/socket-handler";
import { notificationRouter } from "./routes/notification";

dotenv.config();
const apiVersion = "/api/v1";

const app: Express = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : `https://${process.env.CLIENT_DOMAIN}`,
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

initSocketIO(io);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : `https://${process.env.CLIENT_DOMAIN}`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

app.enable("trust proxy");
app.get("/", (req, res) => {
  res.send({ status: "Success", message: "Server is running" });
});

app.use(`${apiVersion}/admin`, adminrouter);
app.use(`${apiVersion}/menus`, menuRouter);
app.use(`${apiVersion}/tables`, tableRouter);
app.use(`${apiVersion}/orders`, orderRouter);
app.use(`${apiVersion}/notifications`, notificationRouter);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join-admin-room", () => {
    socket.join("all-admins");
    console.log(`Admin joined notification room: ${socket.id}`);
  });

  socket.on("leave-admin-room", () => {
    socket.leave("all-admins");
    console.log(`Admin left notification room: ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

io.engine.on("connection_error", (err) => {
  console.log("Socket.io connection error:");
  console.log(err.req);
  console.log(err.code);
  console.log(err.message);
  console.log(err.context);
});

app.all("*", (req, res, next) => {
  next(new ApiError(`Routes does not exist`, 404));
});

app.use(errorHandler);

export { server };
