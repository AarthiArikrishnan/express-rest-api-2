import express from "express";
import {
  getAll,
  findById,
  deleteById,
  updateById,
} from "../services/user.service";
import logger from "../utils/logger";

// GET /users
export const getAllUsers = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    const users = await getAll();
    return res.status(200).json(users);
  } catch (error) {
    logger.error({ err: error }, "getAllUsers error");
    return res.status(500).json({ message: "Unable to fetch users" });
  }
};

// DELETE /users/:id
export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteById(id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User deleted", user: deletedUser });
  } catch (error) {
    logger.error({ err: error }, "deleteUser error");
    return res.status(500).json({ message: "Unable to delete user" });
  }
};

// PATCH /users/:id
export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username)
      return res.status(400).json({ message: "username is required" });

    const user = await findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updated = await updateById(id, { username } as any);
    return res.status(200).json(updated);
  } catch (error) {
    logger.error({ err: error }, "updateUser error");
    return res.status(500).json({ message: "Unable to update user" });
  }
};

// GET /me - return the authenticated user's profile (sanitized)
export const getCurrentUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const identity = (req as any).identity;
    if (!identity)
      return res.status(401).json({ message: "Not authenticated" });

    const out = identity.toObject ? identity.toObject() : identity;
    if (out.authentication) delete out.authentication;

    return res.status(200).json(out);
  } catch (error) {
    logger.error({ err: error }, "getCurrentUser error");
    return res.status(500).json({ message: "Unable to fetch current user" });
  }
};
