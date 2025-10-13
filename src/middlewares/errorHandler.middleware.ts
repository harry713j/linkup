import type { Request, Response, NextFunction } from "express";
import { ApiError } from "@/errors/ApiError";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message: "Something went wrong",
  });
}
