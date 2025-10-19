import { UnauthorizedError } from "@/errors/ApiError";
import { jwtUtil } from "@/utils/jwt";
import { Request, Response, NextFunction } from "express";

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError("Missing Authorization header");
    }

    if (!authHeader.startsWith("Bearer")) {
      throw new UnauthorizedError("Invalid token type");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Invalid authorization format");
    }

    const payload = jwtUtil.verify(token);
    req.user = { id: payload.userId, email: payload.email };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      next(new UnauthorizedError("Token expired"));
    } else {
      next(new UnauthorizedError("Invalid token"));
    }
  }
}
