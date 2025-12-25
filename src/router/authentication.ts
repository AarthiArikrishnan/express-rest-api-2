import express from "express";
import { login, register } from "../controllers/authentication";
import { validateBody } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validation/auth.schema";

export default (router: express.Router) => {
  router.post("/auth/register", validateBody(registerSchema), register);
  router.post("/auth/login", validateBody(loginSchema), login);
};
