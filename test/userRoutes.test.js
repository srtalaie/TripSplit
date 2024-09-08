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

  test('POST - Able to Create a User', async () => {
    const new_user = {
      username: 'NEW_USER',
      first_name: 'New',
      last_name: 'User',
      password: 'Pass1234!',
      email: 'newuser@test.com',
    }

    const res = await api
      .post('/users/create/')
      .send(new_user)
      .expect(201)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.body._id).toBeTruthy()
  })

  test('POST - User is able to login', async () => {
    const res = await api
      .post('/users/login/')
      .send({
        email: user_seeds[0].email,
        password: user_seeds[0].password_hash,
      })
      .expect(200)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.body.email).toEqual(user_seeds[0].email)
  })

  describe('User can preform functions that require login', () => {
    let token
    beforeEach(async () => {
      const password_hash = await bcrypt.hash('Test1234!', 10)
      const new_user = await new User({
        email: 'test1234@test.com',
        username: 'SignedInUser',
        first_name: 'Signed',
        last_name: 'User',
        password_hash,
      }).save()

      const user_signin_info = { email: new_user.email, id: new_user._id }
      return (token = await jwt.sign(user_signin_info, process.env.SECRET))
    })

    test('PUT - User is able to add a friend', async () => {
      const friend = await User.find({
        username: user_seeds[0].username,
      }).exec()

      const res = await api
        .put(`/users/add_friend/${friend[0]._id.toString()}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const user = await User.find({ username: 'SignedInUser' }).exec()

      expect(res.body.friends[0]).toEqual(user[0].friends[0]._id.toString())
    })
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})
