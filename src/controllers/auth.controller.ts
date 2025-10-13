import type { NextFunction, Request, Response } from "express";
import {
  type RegisterInput,
  type LoginInput,
} from "@/validations/auth.schema.js";

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { displayName, email, password }: RegisterInput = req.body;
  } catch (error) {
    // delegate error handling to global error handling
    next(error);
  }
}

export const authController = {
  register,
};
