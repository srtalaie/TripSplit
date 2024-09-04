require('dotenv').config()

const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const request = supertest(app)

const User = require('../models/user')
const users_seeds = require('./data/users.test.data')
const { passwordHasher } = require('./helpers/utils/passwordHasher')

describe('User Routes Tests', () => {
  // beforeAll(async () => {
  //   await mongoose.connect(process.env.MONGO_DEV_URI, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   })
  // })

  beforeEach(async () => {
    for (user in users_seeds) {
      const newUser = new User({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password_hash: await passwordHasher(user.password_hash),
      })
      await newUser.save()
    }
  })

  afterEach(async () => {
    await User.deleteMany()
  })

  afterAll(async (done) => {
    await User.drop()
    await mongoose.connection.close()
  })

  it('GET - Get All Users', async (done) => {
    const res = await request.get('/users/')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(testQuotes.length)
    expect(res.body[0].quote).toBe(testQuotes[0].quote)
    expect(res.body[0].author).toBe(testQuotes[0].author)

    done()
  })
})
