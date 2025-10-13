import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@/errors/ApiError";

export function validate<Type>(schema: ZodType<Type>) {
  return function (req: Request, _: Response, next: NextFunction) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new BadRequestError(result.error.message)
    }

    req.body = result.data;
    next();
  };
}
