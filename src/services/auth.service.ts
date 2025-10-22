import { userRepo, refreshTokenRepo } from "@/repos/auth.repo.js";
import { passwordUtil } from "@/utils/password.js";
import { BadRequestError, UnauthorizedError } from "@/errors/ApiError.js";
import { jwtUtil } from "@/utils/jwt.js";
import { randomUUID } from "crypto";
import { userDetailRepo } from "@/repos/userDetail.repo";
import { config } from "@/config/config";

async function register(username: string, email: string, password: string) {
  const existingUser = await userRepo.findOneByEmail(email);

  if (existingUser) {
    throw new BadRequestError("User already exists with this email");
  }

  const passwordHash = await passwordUtil.generateHash(password);
  const user = await userRepo.create(username.trim(), email, passwordHash);
  const token = jwtUtil.generate({ userId: user.id, email: user.email });
  const refreshTokenValue = randomUUID();
  const expiresAt = new Date(Date.now() + config.refreshTokenValidity);
  const refreshTokenRow = await refreshTokenRepo.create(
    user.id,
    refreshTokenValue,
    expiresAt
  );
  await userDetailRepo.create(user.id, username.trim());

  const refreshToken = refreshTokenRow.token;

  return { user, token, refreshToken };
}

async function login(email: string, password: string) {
  const user = await userRepo.findOneByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  const isValid = await passwordUtil.compare(password, user.passwordHash);
  if (!isValid) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  const token = jwtUtil.generate({ userId: user.id, email: user.email });
  const refreshTokenValue = randomUUID();
  const expiresAt = new Date(Date.now() + config.refreshTokenValidity);
  const refreshTokenRow = await refreshTokenRepo.create(
    user.id,
    refreshTokenValue,
    expiresAt
  );
  const refreshToken = refreshTokenRow.token;

  return { user, token, refreshToken };
}

async function logout(userId: string) {
  const user = await userRepo.findByID(userId);
  if (!user) {
    throw new UnauthorizedError();
  }
  await refreshTokenRepo.deleteOne(user.id);
}

async function refreshJwt(token: string) {
  const refreshToken = await refreshTokenRepo.findOne(token);
  if (!refreshToken) {
    throw new UnauthorizedError("Invalid token");
  }

  const isExpired = refreshToken.expiresAt <= new Date(Date.now());
  if (isExpired) {
    throw new UnauthorizedError("Expired token");
  }

  const user = await userRepo.findByID(refreshToken.userID);
  if (!user) {
    throw new UnauthorizedError("Invalid token");
  }

  const jwtToken = jwtUtil.generate({ userId: user.id, email: user.email });
  return { jwtToken };
}

export const authService = {
  register,
  login,
  logout,
  refreshJwt,
};
