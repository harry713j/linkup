import type { Response, Request } from "express";
import { serverLogger } from "../utils/logger.js";

export async function handleHealth(req: Request, res: Response) {
  try {
    res.status(200).json({
      message: "Server is running well!",
    });
  } catch (error) {
    serverLogger(error as Error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
}
