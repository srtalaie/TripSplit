const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Trip = require('../models/trip')
const User = require('../models/user')

const user_seeds = require('./data/users.test.data')
const { passwordHasher } = require('./helpers/utils/passwordHasher')

const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({}).exec()
  console.log('cleared')
})

describe('User Route Tests', () => {
  beforeEach(async () => {
    user_seeds.forEach(async (user) => {
      let userObject = new User(user)
      userObject.password_hash = await passwordHasher(userObject.password_hash)
      return userObject
    })
    await User.insertMany(user_seeds)
  })

  test('GET - Get All Users', async () => {
    const res = await api
      .get('/users/')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toHaveLength(3)
  })

  test('GET - Get a User', async () => {
    let user = await User.find({ username: user_seeds[0].username })

    const res = await api
      .get(`/users/${user[0]._id.toString()}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(JSON.stringify(res.body)).toEqual(JSON.stringify(user[0]))
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})
