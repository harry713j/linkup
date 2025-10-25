import { createLogger, format, transports } from "winston"

const { colorize, printf, combine, timestamp } = format
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`
})

const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [new transports.Console()]
})


export default logger
