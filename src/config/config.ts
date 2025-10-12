import "dotenv/config";

const allowedOrigins: string[] =
  (process.env.ALLOWED_ORIGIN as string).split(",") || [];

export const config = {
  port: process.env.PORT as string,
  dbUrl: process.env.DATABASE_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  whitelists: allowedOrigins,
};
