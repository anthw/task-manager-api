import mongoose from 'mongoose'

export interface ITask extends mongoose.Document {
  description: string,
  complete: boolean,
  owner: typeof mongoose.Schema.Types.ObjectId,
}

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      red: 'User',
    }
  },
  {
    timestamps: true,
  }
)

const Task = mongoose.model<ITask>('Task', taskSchema)

export default Task