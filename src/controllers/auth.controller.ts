import type { NextFunction, Request, Response, CookieOptions } from "express";
import {
  type RegisterInput,
  type LoginInput,
} from "@/validations/auth.schema.js";
import { authService } from "@/services/auth.service.js";
import { config } from "@/config/config.js";
import logger from "@/logging/logger.js";

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, email, password }: RegisterInput = req.body;
    const { user, token, refreshToken } = await authService.register(
      username,
      email,
      password
    );

    const cookieOption: CookieOptions = {
      httpOnly: true,
      secure: false, // true for prod(https)
      sameSite: "lax",
      path: "/",
      maxAge: config.refreshTokenValidity * 1000,
      expires: new Date(Date.now() + config.refreshTokenValidity * 1000),
    };

    res
      .status(201)
      .cookie("refresh_token", refreshToken, cookieOption)
      .json({
        message: "User registration successful",
        user: { id: user.id, displayName: user.username, email: user.email },
        accessToken: token,
      });
  } catch (error) {
    const err = error as Error;
    logger.error(`User Sign up failed: ${err.message}`, { stack: err.stack });
    next(error);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password }: LoginInput = req.body;
    const { user, token, refreshToken } = await authService.login(
      email,
      password
    );

    const cookieOption: CookieOptions = {
      httpOnly: true,
      secure: false, // true for prod(https)
      sameSite: "lax",
      path: "/",
      maxAge: config.refreshTokenValidity * 1000,
      expires: new Date(Date.now() + config.refreshTokenValidity * 1000),
    };

    res
      .status(200)
      .cookie("refresh_token", refreshToken, cookieOption)
      .json({
        message: "User login successful",
        user: { id: user.id, displayName: user.username, email: user.email },
        accessToken: token,
      });
  } catch (error) {
    const err = error as Error;
    logger.error(`User login failed: ${err.message}`, { stack: err.stack });
    next(error);
  }
}

async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id as string;
    await authService.logout(userId);

    res.status(200).clearCookie("refresh_token").json({
      message: "User logout successful",
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`User logout failed: ${err.message}`, { stack: err.stack });
    next(error);
  }
}

async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies?.refresh_token;
    const { jwtToken } = await authService.refreshJwt(refreshToken as string);

    res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken: jwtToken,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`JWT refresh failed: ${err.message}`, { stack: err.stack });
    next(error);
  }
}

export const authController = {
  register,
  login,
  logout,
  refresh,
};
