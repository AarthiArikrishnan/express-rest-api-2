import express from 'express';
import {
  getUsers,
  getUserById,
  deleteUserById,
} from '../db/users';

export const getAllUsers = async (
  _: express.Request,
  res: express.Response
) => {
  const users = await getUsers();
  return res.status(200).json(users);
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  const deletedUser = await deleteUserById(id);
  return res.json(deletedUser);
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!username) return res.sendStatus(400);

  const user = await getUserById(id);
  if (!user) return res.sendStatus(404);

  user.username = username;
  await user.save();

  return res.status(200).json(user);
};
