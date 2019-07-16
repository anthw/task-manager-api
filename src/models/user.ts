import mongoose, { Model } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Task from './task'

import { ITask } from './task'

export interface Token {
  token: string
}

export interface IUser extends mongoose.Document {
  _id: string,
  name: string,
  email: string,
  password: string,
  age: number,
  tokens: Token[],
  avatar: Buffer,
  tasks: ITask[],
  generateAuthToken: () => void,
  toJSON: () => void,
}

export interface IUserModel extends Model<IUser> {
  findByCredentials: (email: string, password: string) => IUser,
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid')
        }

        return true
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value: string) {
        if (value.toLowerCase().includes('password')) {
          throw new Error(`Password cannot contain the word 'password'`)
        }

        return true
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error('Age must be a positive number')
        }

        return true
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        }
      }
    ],
    avatar: {
      type: Buffer,
    }
  },
  {
    timestamps: true
  }
)

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
  const user = this
  const userObj = user.toObject()
  
  delete userObj.password
  delete userObj.tokens
  delete userObj.avatar

  return userObj
}

userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

userSchema.statics.findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Unable to log in')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to log in')
  }

  return user
}

// has the plain text password before saving
userSchema.pre('save', async function(next) {
  const user = this as IUser

if (user.isModified('password')) {
  user.password = await bcrypt.hash(user.password, 8)
}

  next()
})

// Remove all tasks for a user when they delete their account
userSchema.pre('remove', async function(next) {
  const user = this

  await Task.deleteMany({ owner: user.id })

  next()
})

const User = mongoose.model<IUser, IUserModel>('User', userSchema)

export default User