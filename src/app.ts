import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import { visitedEndpointsLogger } from "./utils/logger.js";
import { ALLOWED_CLIENT } from "./constants.js";
import { catchAllRouter, healthRouter } from "./routes/index.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_CLIENT,
    credentials: true,
  },
});

app.use(
  cors({
    origin: ALLOWED_CLIENT,
    credentials: true,
  })
);

app.use(express.json({}));
app.use(cookieParser());
app.use(visitedEndpointsLogger);

app.use("/api/v1/healthz", healthRouter);
app.use("/{*any}", catchAllRouter);

export { httpServer, io };
