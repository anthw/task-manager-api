import request from 'supertest'

import { app } from '../src/app'
import Task from '../src/models/task'
import {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  setUpDatabase,
  taskOne,
  taskTwo,
  taskThree,
} from './fixtures/db'

beforeEach(setUpDatabase)

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'Put the bin out'
    })
    .expect(201)

  const task = await Task.findById(response.body._id)

  expect(task).not.toBeNull()
  expect(task.completed).toEqual(false)
})

test('Should fetch all tasks for user', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

  expect(response.body.length).toEqual(2)
})

test('Should not delete task for wrong user', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(404)

  const task = await Task.findById(taskOne._id)

  expect(task).not.toBeNull()
})
