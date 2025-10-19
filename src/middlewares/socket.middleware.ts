import { jwtUtil } from "@/utils/jwt.js";
import { UnauthorizedError } from "@/errors/ApiError.js";
import { Socket } from "socket.io";
import { userService } from "@/services/user.service.js";

export async function verifySocketToken(socket: Socket, next: any) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      throw new UnauthorizedError("No token found");
    }

    const decoded = jwtUtil.verify(token);
    if (typeof decoded === "string" || !("userId" in decoded)) {
      throw new UnauthorizedError("Invalid token");
    }

    const user = await userService.fetchUser(decoded.userId);
    if (!user) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    socket.userId = user.id;
    next();
  } catch (error) {
    next(new UnauthorizedError("Unauthorized: " + error));
  }
}
