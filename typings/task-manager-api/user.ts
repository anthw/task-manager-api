import mongoose, { Model } from 'mongoose'
import { ITask } from './task'

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId
  name: string,
  email: string,
  password: string,
  age: number,
  tokens: { token: string }[],
  avatar: Buffer,
  tasks: ITask[],
  generateAuthToken: () => void,
  toJSON: () => void,
}

export interface IUserModel extends Model<IUser> {
  findByCredentials: (email: string, password: string) => IUser,
}