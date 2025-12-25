import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log("inside isAuthenticated");
  try {
    const sessionToken = req.cookies["ANTONIO-AUTH"];
    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
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

    if (!currentUserId) {
      return res.sendStatus(401);
    }

    if (currentUserId !== ownerId) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
