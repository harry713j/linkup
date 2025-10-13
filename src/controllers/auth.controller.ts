import type { NextFunction, Request, Response, CookieOptions } from "express";
import {
  type RegisterInput,
  type LoginInput,
} from "@/validations/auth.schema.js";
import { authService } from "@/services/auth.service";
import { config } from "@/config/config";

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { displayName, email, password }: RegisterInput = req.body;
    const { user, token, refreshToken } = await authService.register(
      displayName,
      email,
      password
    );

    const cookieOption: CookieOptions = {
      httpOnly: true,
      secure: false, // true for prod(https)
      sameSite: "lax",
      path: "/",
      maxAge: config.refreshTokenValidity,
      expires: new Date(Date.now() + config.refreshTokenValidity),
    };

    res
      .status(201)
      .cookie("refresh_token", refreshToken, cookieOption)
      .json({
        message: "User registration successful",
        user: { id: user.id, displayName: user.displayName, email: user.email },
        accessToken: token,
      });
  } catch (error) {
    // delegate error handling to global error handling
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
      maxAge: config.refreshTokenValidity,
      expires: new Date(Date.now() + config.refreshTokenValidity),
    };

    res
      .status(200)
      .cookie("refresh_token", refreshToken, cookieOption)
      .json({
        message: "User login successful",
        user: { id: user.id, displayName: user.displayName, email: user.email },
        accessToken: token,
      });
  } catch (error) {
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
    next(error);
  }
}

async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies?.refresh_token;
    console.log("Refresh token: ", refreshToken);
    const jwtToken = await authService.refreshJwt(refreshToken as string);

    res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken: jwtToken,
    });
  } catch (error) {
    next(error);
  }
}

export const authController = {
  register,
  login,
  logout,
  refresh,
};
