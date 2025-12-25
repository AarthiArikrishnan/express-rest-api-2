import express from "express";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  getCurrentUser,
} from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";
import {
  validateBody,
  validateParams,
} from "../middlewares/validate.middleware";
import { idParamSchema, updateUserSchema } from "../validation/user.schema";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.get("/me", isAuthenticated, getCurrentUser);

  router.delete(
    "/users/:id",
    isAuthenticated,
    validateParams(idParamSchema),
    isOwner,
    deleteUser
  );
  router.patch(
    "/users/:id",
    isAuthenticated,
    validateParams(idParamSchema),
    isOwner,
    validateBody(updateUserSchema),
    updateUser
  );
};
