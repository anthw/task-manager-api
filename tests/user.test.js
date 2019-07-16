import request from 'supertest'

import { app } from '../src/app'
import User from '../src/models/user'
import { userOneId, userOne, setUpDatabase} from './fixtures/db'

beforeEach(setUpDatabase)

test('Should sign up a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Anthony',
      email: 'anth@example.com',
      password: '1234567',
    })
    .expect(201)

  const user = await User.findById(response.body.user._id)

  expect(user).not.toBeNull()
  expect(response.body).toMatchObject({
    user: {
      name: 'Anthony',
      email: 'anth@example.com',
    },
    token: user.tokens[0].token,
  })
  expect(user.password).not.toBe('1234567')
})

test('Should log in existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({ email: userOne.email, password: userOne.password })
    .expect(200)

  const user = await User.findById(response.body.user._id)

  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not log in nonexistant user', async () => {
  await request(app)
    .post('/users/login')
    .send({ email: 'noone@example.com', password: '1234567' })
    .expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
  const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findById(response.body._id)

  expect(user).toBeNull()
})

test('Should not delete account for unauthenticate user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

  const user = await User.findById(userOneId)

  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
  const response = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Bobby',
    })
    .expect(200)

  const user = await User.findById(response.body._id)

  expect(response.body.name).toBe(user.name)
})

test('Should not update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'Wales',
    })
    .expect(400)
})