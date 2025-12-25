import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import logger from "../utils/logger";

// Validation middleware using Zod. It parses and replaces `req.body` with the parsed value.
export const validateBody =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      return next();
    } catch (err: any) {
      const issues = err?.errors || [{ message: err.message }];
      logger.error({ issues }, "Validation Error");
      return res.status(400).json({ message: "Validation failed", issues });
    }
  };

export const validateParams =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.params);
      req.params = parsed as any;
      return next();
    } catch (err: any) {
      const issues = err?.errors || [{ message: err.message }];
      return res.status(400).json({ message: "Validation failed", issues });
    }
  };
