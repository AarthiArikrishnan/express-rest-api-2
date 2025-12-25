import { random, authentication as hash } from "../helpers";
import * as userService from "./user.service";

export const registerUser = async (
  email: string,
  username: string,
  password: string
) => {
  const existing = await userService.findByEmail(email);
  if (existing) throw new Error("UserExists");

  const salt = random();
  const user = await userService.create({
    email,
    username,
    authentication: {
      salt,
      password: hash(salt, password),
    },
  });

  if ((user as any).authentication) delete (user as any).authentication;
  return user;
};

export const authenticateUser = async (email: string, password: string) => {
  // load secret fields
  const user = (await userService.findByEmail(email)) as any;
  if (!user) return null;

  console.log("Usres", user);

  const expected = hash(user.authentication.salt, password);
  if (user.authentication.password !== expected) return null;

  const salt = random();
  user.authentication.sessionToken = hash(salt, user._id.toString());
  await user.save();

  const out = user.toObject ? user.toObject() : user;
  if (out.authentication) delete out.authentication;
  return out;
};
