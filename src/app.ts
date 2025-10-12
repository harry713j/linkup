import express, { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import { visitedEndpointsLogger } from "./utils/logger.js";
import { config } from "./config/config.js";
import { catchAllRouter, healthRouter } from "./routes/index.js";

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

app.use("/api/v1/healthz", healthRouter);
app.use("/{*any}", catchAllRouter);

export { httpServer, io };
