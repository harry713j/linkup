import { jwtUtil } from "@/utils/jwt.js";
import { UnauthorizedError } from "@/errors/ApiError.js";
import { Socket } from "socket.io";
import { userService } from "@/services/user.service.js";
import logger from "@/logging/logger.js";

export async function verifySocketToken(socket: Socket, next: any) {
  try {
    logger.debug("Attempting to Authorize the socket connection");
    const token = socket.handshake.auth?.token;
    if (!token) {
      logger.warn(
        "Socket authorization failed: No token found for socket id=" + socket.id
      );
      throw new UnauthorizedError("No token found");
    }

    const decoded = jwtUtil.verify(token);
    if (typeof decoded === "string" || !("userId" in decoded)) {
      logger.warn(
        "Socket authorization failed: invalid token for socket id=" + socket.id
      );
      throw new UnauthorizedError("Invalid token");
    }

    const user = await userService.fetchUser(decoded.userId);
    if (!user) {
      logger.warn(
        "Socket authorization failed: user not found for socket id=" + socket.id
      );
      throw new UnauthorizedError("Invalid or expired token");
    }

    socket.userId = user.id;
    logger.info(
      "Socket authorization is successful for socket id=" + socket.id
    );
    next();
  } catch (error: any) {
    logger.error(
      "Failed to authorized the socket connection: ",
      error.message,
      {
        stack: error.message,
      }
    );
    next(new UnauthorizedError("Unauthorized: " + error));
  }
}
