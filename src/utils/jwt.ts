import { config } from "@/config/config";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { randomUUID } from "crypto"

export interface TokenPayload extends JwtPayload {
  userId: string;
  email?: string;
}

export const jwtUtil = {
  generate(payload: TokenPayload) {
    return jwt.sign({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      jti: randomUUID()
    }, config.jwtSecret, {
      expiresIn: config.jwtExpiry as jwt.SignOptions["expiresIn"],
    });
  },
  verify(token: string): TokenPayload {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (typeof decoded === "string" || !("userId" in decoded)) {
      throw new Error("Invalid token payload");
    }

    return decoded as TokenPayload;
  },
};
