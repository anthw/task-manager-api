import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

import User from '../../src/models/user'
import Task from '../../src/models/task'

export const userOneId = new mongoose.Types.ObjectId()
export const userOne = {
  _id: userOneId,
  name: 'Billy',
  email: 'billy@example.com',
  password: '1234567',
  tokens: [
    {
      token: jwt.sign({_id: userOneId }, process.env.JWT_SECRET)
    }
  ]
}

export const userTwoId = new mongoose.Types.ObjectId()
export const userTwo = {
  _id: userTwoId,
  name: 'Bobby',
  email: 'bobby@example.com',
  password: '1234567',
  tokens: [
    {
      token: jwt.sign({_id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
}

export const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  owner: userOne._id,
}

export const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  completed: true,
  owner: userOne._id,
}

export const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  completed: false,
  owner: userTwo._id,
}

export const setUpDatabase = async () => {
  await User.deleteMany({})
  await Task.deleteMany({})
  await new User(userOne).save()
  await new User(userTwo).save()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()
}