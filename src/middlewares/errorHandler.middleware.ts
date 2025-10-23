import type { Request, Response } from "express";
import { ApiError } from "@/errors/ApiError.js";

export function errorHandler(err: any, req: Request, res: Response) {
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
