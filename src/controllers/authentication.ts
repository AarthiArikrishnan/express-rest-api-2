import express from "express";
import { getUserByEmail, createUser } from "../db/users";
import { random, authentication } from "../helpers";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      console.warn("Email/Password/Username is required");
      return res
        .status(400)
        .json({ message: "Email/Password/Username is required" });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "already user is existing" });
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.error("Register >> Error", error);
    return res.status(500).json({ message: "Unabole to getister" });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(401);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("ANTONIO-AUTH", user.authentication.sessionToken, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
