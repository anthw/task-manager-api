import mongoose from 'mongoose'
import { ITask } from '../../typings/task-manager-api/task'

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