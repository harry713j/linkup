import { UnauthorizedError } from "@/errors/ApiError.js";
import { jwtUtil } from "@/utils/jwt.js";
import { Request, Response, NextFunction } from "express";
import logger from "@/logging/logger.js";

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    logger.debug("Attempting to authorize the user");
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      logger.warn(
        "Authorization failed: No header found for request: " + req.path
      );
      throw new UnauthorizedError("Missing Authorization header");
    }

    if (!authHeader.startsWith("Bearer")) {
      logger.warn("Authorization failed: Invalid token");
      throw new UnauthorizedError("Invalid token type");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      logger.warn("Authorization failed: Invalid token format");
      throw new UnauthorizedError("Invalid authorization format");
    }

    const payload = jwtUtil.verify(token);
    req.user = { id: payload.userId, email: payload.email };
    logger.info("Authorization successful with user id=" + payload.userId);
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      logger.warn("Authorization failed: JWT token expired");
      next(new UnauthorizedError("Token expired"));
    } else {
      logger.error("Failed to authorize the user: ", error.message);
      next(new UnauthorizedError("Invalid token"));
    }
  }
}
