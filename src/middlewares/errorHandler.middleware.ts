import type { Request, Response } from "express";
import { ApiError } from "@/errors/ApiError.js";
import logger from "@/logging/logger.js";

export function errorHandler(err: any, req: Request, res: Response) {
  logger.error(`${req.method} ${req.url} - ${err.message}`, {
    stack: err.stack,
    user: req.user?.id,
  });

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message: "Something went wrong",
  });
}
