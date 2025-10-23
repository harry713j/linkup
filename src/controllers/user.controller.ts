import type { Request, Response, NextFunction } from "express";
import { userService } from "@/services/user.service.js";
import {
  UpdateEmailInput,
  UpdatePasswordInput,
  UpdateProfileUrlInput,
  UpdateUserDetailInput,
} from "@/validations/user.schema.js";

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { displayName, bio, status }: UpdateUserDetailInput = req.body;

    const user = await userService.update(userId as string, {
      displayName,
      bio,
      status,
    });

    res.status(200).json({
      message: "User details update successful",
      user: user,
    });
  } catch (error) {
    next(error);
  }
}

async function updateEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { email }: UpdateEmailInput = req.body;

    const user = await userService.updateEmail(userId as string, email);
    res.status(200).json({
      message: "User email update successful",
      user: user,
    });
  } catch (error) {
    next(error);
  }
}

async function updatePassword(req: Request, res: Response, next: NextFunction) {
  // implement email verification
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword }: UpdatePasswordInput = req.body;

    const user = await userService.updatePassword(
      userId as string,
      oldPassword,
      newPassword
    );
    res.status(200).json({
      message: "User password update successful",
      user: user,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfileUrl(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // implement cloud storage upload
  try {
    const userId = req.user?.id;
    const { profileUrl }: UpdateProfileUrlInput = req.body;

    const user = await userService.updateProfileUrl(
      userId as string,
      profileUrl
    );
    res.status(200).json({
      message: "User profile picture update successful",
      user: user,
    });
  } catch (error) {
    next(error);
  }
}

async function removeProfileUrl(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;

    const user = await userService.removeProfileUrl(userId as string);
    res.status(200).json({
      message: "User profile picture remove successful",
      user: user,
    });
  } catch (error) {
    next(error);
  }
}

async function fetchUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const user = await userService.fetchUser(userId as string);

    res.status(200).json({
      message: "User details fetched successfully",
      user: user,
    });
  } catch (error) {
    next(error);
  }
}

export const userController = {
  update,
  updateEmail,
  updatePassword,
  updateProfileUrl,
  removeProfileUrl,
  fetchUser,
};
