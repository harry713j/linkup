import "dotenv/config";

const allowedOrigins: string[] =
  (process.env.ALLOWED_ORIGIN as string).split(",") || [];

const refreshTokenValidity = parseInt(
  process.env.REFRESH_TOKEN_EXPIRY as string,
  10
);

if (typeof refreshTokenValidity !== "number") {
  throw new Error("Invalid Refresh Token Expiry value from .env");
}

export const config = {
  port: process.env.PORT as string,
  dbUrl: process.env.DATABASE_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiry: process.env.JWT_EXPIRY as string,
  whitelists: allowedOrigins,
  refreshTokenValidity: refreshTokenValidity,
};
