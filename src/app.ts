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
import { reportRouter } from "./routes/report";
import { statsRouter } from "./routes/stats";
import { locationSettingRouter } from "./routes/location-setting";
import { rateLimiter } from "./middleware/rate-limiter";

dotenv.config();

const apiVersion = "/api/v1";
const app: Express = express();
const server = createServer(app);

app.set("trust proxy", true);

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "development"
        ? ["http://localhost:3000", "http://127.0.0.1:3000"]
        : [
            `https://${process.env.CLIENT_DOMAIN}`,
            `https://www.${process.env.CLIENT_DOMAIN}`,
          ],
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,

  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,

  allowRequest: (req, callback) => {
    console.log("Socket.IO connection attempt from:", {
      origin: req.headers.origin,
      userAgent: req.headers["user-agent"],
      realIP: req.headers["x-real-ip"],
      forwardedFor: req.headers["x-forwarded-for"],
      forwardedProto: req.headers["x-forwarded-proto"],
    });

    callback(null, true);
  },
});

initSocketIO(io);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins =
        process.env.NODE_ENV === "development"
          ? ["http://localhost:3000", "http://127.0.0.1:3000"]
          : [
              `https://${process.env.CLIENT_DOMAIN}`,
              `https://www.${process.env.CLIENT_DOMAIN}`,
            ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cookie",
      "Set-Cookie",
      "Access-Control-Allow-Credentials",
    ],
    optionsSuccessStatus: 200,
  })
);

app.get("/", (req, res) => {
  res.json({
    status: "Success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.get("/socket.io/health", (req, res) => {
  res.json({
    status: "OK",
    socketIO: "Ready",
    connectedSockets: io.engine.clientsCount,
    transports: ["websocket", "polling"],
  });
});

app.use(`${apiVersion}/admin`, adminrouter);
app.use(`${apiVersion}/menus`, menuRouter);
app.use(`${apiVersion}/tables`, tableRouter);
app.use(`${apiVersion}/orders`, orderRouter);
app.use(`${apiVersion}/notifications`, notificationRouter);
app.use(`${apiVersion}/reports`, reportRouter);
app.use(`${apiVersion}/stats`, statsRouter);
app.use(`${apiVersion}/location-settings`, locationSettingRouter);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  console.log("Connection details:", {
    transport: socket.conn.transport.name,
    remoteAddress: socket.conn.remoteAddress,
    headers: socket.handshake.headers,
  });

  socket.on("join-admin-room", () => {
    socket.join("all-admins");
    console.log(`Admin joined notification room: ${socket.id}`);
  });

  socket.on("leave-admin-room", () => {
    socket.leave("all-admins");
    console.log(`Admin left notification room: ${socket.id}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
  });

  socket.on("error", (error) => {
    console.log(`Socket error for ${socket.id}:`, error);
  });
});

io.engine.on("connection_error", (err) => {
  console.log("=== Socket.IO Connection Error ===");
  console.log("Error Code:", err.code);
  console.log("Error Message:", err.message);
  console.log("Error Context:", err.context);

  if (err.req) {
    console.log("Request Details:");
    console.log("- URL:", err.req.url);
    console.log("- Method:", err.req.method);
    console.log("- HTTP Version:", err.req.httpVersion);
    console.log("- Headers:", JSON.stringify(err.req.headers, null, 2));
  }
  console.log("=====================================");
});

io.engine.on("initial_headers", (headers, req) => {
  console.log("Setting initial headers for:", req.url);
});

io.engine.on("headers", (headers, req) => {
  console.log("Setting headers for:", req.url);
});

app.all("*", (req, res, next) => {
  next(new ApiError(`Route ${req.originalUrl} does not exist`, 404));
});

app.use(errorHandler);

export { server, io };
