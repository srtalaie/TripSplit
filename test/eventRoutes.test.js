const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Trip = require('../models/trip')
const User = require('../models/user')
const Event = require('../models/event')

const user_seeds = require('./data/users.test.data')
const { passwordHasher } = require('./helpers/utils/passwordHasher')

const app = require('../app')

const api = supertest(app)

beforeAll(async () => {
  await User.deleteMany({}).exec()
  await Trip.deleteMany({}).exec()
  await Event.deleteMany({}).exec()
  console.log('cleared')
})

describe('Event Routes Tests', () => {
  let token
  // Create User (trip owner) & Trip and Add User's as Members
  beforeAll(async () => {
    const password_hash = await bcrypt.hash('Test1234!', 10)
    const new_user = await new User({
      first_name: 'Trip',
      last_name: 'Owner',
      email: 'trip_owner@test.com',
      username: 'TripOwner',
      password_hash,
    }).save()
    user_seeds.forEach(async (user) => {
      let userObject = new User(user)
      userObject.password_hash = await passwordHasher(userObject.password_hash)
      return userObject
    })
    await User.insertMany(user_seeds)

    const user_signin_info = { email: new_user.email, id: new_user._id }
    token = await jwt.sign(user_signin_info, process.env.SECRET)

    const friends = await User.find({ _id: { $ne: new_user._id } }).exec()

    // Add users to new_user friends
    new_user.friends = friends
    await new_user.save()

    // Add new_user to friends
    const friends_friend_array_update = friends.map(async (friend) => {
      friend.friends = friend.friends.concat(new_user._id)
      await friend.save()
    })
    await Promise.all(friends_friend_array_update)

    // Create array to save member ids for members array in new Trip
    const member_array = friends.map((user) => {
      return { member: user._id }
    })

    // Create a trip to add events to
    await new Trip({
      trip_name: 'Trip 1',
      trip_description: 'Description for Trip 1',
      owner: new_user._id,
      members: [...member_array, { member: new_user._id }],
    }).save()

    return token
  })

  test('GET - Get all Events', async () => {
    console.log('TODO')
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})
