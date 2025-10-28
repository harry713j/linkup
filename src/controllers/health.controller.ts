import logger from "@/logging/logger.js";
import type { Response, Request } from "express";

export async function handleHealth(req: Request, res: Response) {
  try {
    res.status(200).json({
      message: "Server is running well!",
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Server is not up: ${err.message}`, { stack: err.stack });
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
}
