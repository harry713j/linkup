import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validate<Type>(schema: ZodType<Type>) {
  return function (req: Request, res: Response, next: NextFunction) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: result.error.message,
      });
    }

    req.body = result.data;
    next();
  };
}
