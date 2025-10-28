import { userRepo, refreshTokenRepo } from "@/repos/auth.repo.js";
import { passwordUtil } from "@/utils/password.js";
import { BadRequestError, UnauthorizedError } from "@/errors/ApiError.js";
import { jwtUtil } from "@/utils/jwt.js";
import { randomUUID } from "crypto";
import { userDetailRepo } from "@/repos/userDetail.repo.js";
import { config } from "@/config/config.js";
import logger from "@/logging/logger.js";

async function register(username: string, email: string, password: string) {
  logger.debug("Attempting to register an user");
  const existingUser = await userRepo.findOneByEmail(email);

  if (existingUser) {
    logger.warn("User already exists with email=" + email);
    throw new BadRequestError("User already exists with this email");
  }

  const passwordHash = await passwordUtil.generateHash(password);
  const user = await userRepo.create(username.trim(), email, passwordHash);
  const token = jwtUtil.generate({ userId: user.id, email: user.email });
  const refreshTokenValue = randomUUID();
  const expiresAt = new Date(Date.now() + config.refreshTokenValidity * 1000);
  const refreshTokenRow = await refreshTokenRepo.create(
    user.id,
    refreshTokenValue,
    expiresAt
  );
  await userDetailRepo.create(user.id, username.trim());

  const refreshToken = refreshTokenRow.token;
  logger.info(`User registered successfully on DB with id=${user.id}`);
  return { user, token, refreshToken };
}

async function login(email: string, password: string) {
  logger.debug("Attempting to login the user");
  const user = await userRepo.findOneByEmail(email);
  if (!user) {
    logger.warn("User with email=" + email + " not exists");
    throw new UnauthorizedError("Invalid Credentials");
  }

  const isValid = await passwordUtil.compare(password, user.passwordHash);
  if (!isValid) {
    logger.warn("User with email=" + email + " provided an incorrect password");
    throw new UnauthorizedError("Invalid Credentials");
  }

  const token = jwtUtil.generate({ userId: user.id, email: user.email });
  const refreshTokenValue = randomUUID();
  const expiresAt = new Date(Date.now() + config.refreshTokenValidity * 1000);
  const refreshTokenRow = await refreshTokenRepo.create(
    user.id,
    refreshTokenValue,
    expiresAt
  );
  const refreshToken = refreshTokenRow.token;
  logger.info("User credentials verified successfully with email=" + email);
  return { user, token, refreshToken };
}

async function logout(userId: string) {
  logger.debug("Attempting to logout the user");
  const user = await userRepo.findByID(userId);
  if (!user) {
    logger.warn("Unauthorized: user id=" + userId + " not registered");
    throw new UnauthorizedError();
  }
  await refreshTokenRepo.deleteOne(user.id);
  logger.info(`User with user id=${userId} logout and remove Refresh Token`);
}

async function refreshJwt(token: string) {
  logger.debug("Attempting to refresh JWT");
  const refreshToken = await refreshTokenRepo.findOne(token);
  if (!refreshToken) {
    logger.warn("Refreshed Failed: Refresh Token not found");
    throw new UnauthorizedError("Invalid token");
  }

  const isExpired = refreshToken.expiresAt <= new Date(Date.now());
  if (isExpired) {
    logger.warn("Refreshed Failed: Refresh Token is expired");
    throw new UnauthorizedError("Expired token");
  }

  const user = await userRepo.findByID(refreshToken.userID);
  if (!user) {
    logger.warn(
      "Refreshed Failed: Refresh Token is not associated with existing user"
    );
    throw new UnauthorizedError("Invalid token");
  }

  const jwtToken = jwtUtil.generate({ userId: user.id, email: user.email });
  logger.info(`JWT refreshed successfully for userId=${user.id}`);
  return { jwtToken };
}

export const authService = {
  register,
  login,
  logout,
  refreshJwt,
};
