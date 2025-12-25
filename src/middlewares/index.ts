import express from "express";
import { get, merge } from "lodash";
import { findBySessionToken } from "../services/user.service";
import logger from "../utils/logger";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["ANTONIO-AUTH"];
    if (!sessionToken)
      return res.status(401).json({ message: "Not authenticated" });

    const existingUser = await findBySessionToken(sessionToken);
    if (!existingUser)
      return res.status(401).json({ message: "Invalid session" });

    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    logger.error({ err: error }, "isAuthenticated error");
    return res.status(500).json({ message: "Authentication failed" });
  }
};

export const isOwner = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const currentUserId = String(get(req, "identity._id"));
    const ownerId = req.params.id;

    if (!currentUserId)
      return res.status(401).json({ message: "Not authenticated" });
    if (currentUserId !== ownerId)
      return res.status(403).json({ message: "Forbidden" });

    return next();
  } catch (error) {
    logger.error({ err: error }, "isOwner error");
    return res.status(500).json({ message: "Authorization failed" });
  }
};
