import express, { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import { visitedEndpointsLogger } from "./utils/logger.js";
import { config } from "./config/config.js";
import {
  catchAllRouter,
  healthRouter,
  authRouter,
  userRouter,
  chatRouter,
  messageRouter,
} from "./routes/index.js";
import { errorHandler } from "@/middlewares/errorHandler.middleware.js";
import initializeSocket from "./socket/index.js";

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, cb) => {
      if (!origin || config.whitelists.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
});

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || config.whitelists.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({}));
app.use(cookieParser());
app.use(visitedEndpointsLogger);

app.use("/healthz", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/{*any}", catchAllRouter);
// must be at last
app.use(errorHandler);

initializeSocket(io)

export { httpServer };
