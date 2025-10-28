import { config } from "@/config/config.js";
import { createLogger, format, transports } from "winston";

const { colorize, printf, combine, timestamp, errors } = format;
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: config.environment === "production" ? "info" : "debug",
  format: combine(
    colorize({ all: config.environment !== "production" }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [new transports.Console()],
});

logger.exceptions.handle(new transports.Console());

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
});

export default logger;
