import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@/errors/ApiError.js";
import logger from "@/logging/logger.js";

export function validate<Type>(schema: ZodType<Type>) {
  logger.debug("Attempting to validate the payload");
  return function (req: Request, _: Response, next: NextFunction) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      logger.warn("Payload validation failed: " + result.error.message);
      throw new BadRequestError(result.error.message);
    }

    req.body = result.data;
    logger.info("Payload validation successful! " + result.success.valueOf);
    next();
  };
}
