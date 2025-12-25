import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export interface ApiError extends Error {
  status?: number;
}

// Centralized error handler - keep responses consistent and avoid leaking details
export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || 500;
  const message = status === 500 ? "Internal server error" : err.message;

  // Log full error on server side
  logger.error({ err }, "Unhandled error");

  res.status(status).json({ message });
};
