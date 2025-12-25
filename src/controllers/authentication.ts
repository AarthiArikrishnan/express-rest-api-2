import express from "express";
import * as authService from "../services/auth.service";
import * as userService from "../services/user.service";
import logger from "../utils/logger";

// Register a new user
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    try {
      const user = await authService.registerUser(email, username, password);
      return res.status(201).json(user);
    } catch (err: any) {
      if (err.message === "UserExists")
        return res.status(409).json({ message: "User already exists" });
      throw err;
    }
  } catch (error) {
    logger.error({ err: error }, "Register >> Error");
    return res.status(500).json({ message: "Unable to register user" });
  }
};

// Login and issue a session cookie
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    const user = await authService.authenticateUser(email, password);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // session token is set by the service on the DB record; retrieve it
    const fresh = (await userService.findByEmail(email));

    const token = fresh?.authentication?.sessionToken;

    if (token) {
      res.cookie("ANTONIO-AUTH", token, { httpOnly: true, sameSite: "lax" });
    }

    return res.status(200).json(user);
  } catch (error) {
    logger.error({ err: error }, "Login error");
    return res.status(500).json({ message: "Unable to login" });
  }
};
