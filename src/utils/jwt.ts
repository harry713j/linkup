import { config } from "@/config/config";
import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email?: string;
}

export const jwtUtil = {
  generate(payload: TokenPayload) {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiry as jwt.SignOptions["expiresIn"],
    });
  },
  verify(token: string): TokenPayload {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (typeof decoded === "string" || "userId" in decoded) {
      throw new Error("Invalid token payload");
    }

    return decoded as TokenPayload;
  },
};
