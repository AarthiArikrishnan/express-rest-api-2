import { FilterQuery, UpdateQuery } from "mongoose";
import UserModel, { IUser } from "../models/user.model";

export const getAll = () => UserModel.find().lean();

export const findById = (id: string) => UserModel.findById(id);

export const findByEmail = (email: string) => UserModel.findOne({ email });

export const findBySessionToken = (token: string) =>
  UserModel.findOne({
    "authentication.sessionToken": token,
  } as FilterQuery<IUser>);

export const create = (values: Record<string, any>) =>
  new UserModel(values).save().then((user: IUser) => user.toObject());

export const updateById = (id: string, update: UpdateQuery<IUser>) =>
  UserModel.findByIdAndUpdate(id, update, { new: true });

export const deleteById = (id: string) => UserModel.findByIdAndDelete(id);
