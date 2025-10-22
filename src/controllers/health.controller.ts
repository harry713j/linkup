import type { Response, Request } from "express";

export async function handleHealth(req: Request, res: Response) {
  try {
    res.status(200).json({
      message: "Server is running well!",
    });
  } catch (error) {
    console.error("Server Error: ", error)
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
}
