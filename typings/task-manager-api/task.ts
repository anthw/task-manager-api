import mongoose from 'mongoose'

export interface ITask extends mongoose.Document {
  description: string,
  completed: boolean,
  owner: mongoose.Types.ObjectId,
}

export interface ITaskUpdate {
  description?: string,
  completed?: boolean,
}