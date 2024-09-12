const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Trip = require('../models/trip')
const User = require('../models/user')

const app = require('../app')

const api = supertest(app)

beforeAll(async () => {
  await Trip.deleteMany({}).exec()
  await User.deleteMany({}).exec()
  console.log('cleared')
})

describe('Trip Routes Tests', () => {
  let token
  beforeAll(async () => {
    const password_hash = await bcrypt.hash('Test1234!', 10)
    const new_user = await new User({
      first_name: 'User',
      last_name: 'One',
      email: 'user_1@test.com',
      username: 'User_1',
      password_hash,
    }).save()

    const user_signin_info = { email: new_user.email, id: new_user._id }
    return (token = await jwt.sign(user_signin_info, process.env.SECRET))
  })

  test('POST - Create a Trip', async () => {
    const new_trip = {
      trip_name: 'Trip 1',
      trip_description: 'Description for Trip 1',
    }

    const res = await api
      .post('/trips/create')
      .set('Authorization', `Bearer ${token}`)
      .send(new_trip)
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(res.body._id).toBeTruthy()
  })

  test('GET - Get All Trips', async () => {
    const res = await api
      .get('/trips/')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body).toHaveLength(1)
  })

  test('GET - Get a Specific Trip', async () => {
    const trip = await Trip.find({ trip_name: 'Trip 1' })
      .populate('owner')
      .exec()

    const res = await api
      .get(`/trips/${trip[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(JSON.stringify(res.body)).toEqual(JSON.stringify(trip[0]))
  })

  test('PUT - Update a Trip', async () => {
    const trip = await Trip.find({ trip_name: 'Trip 1' }).exec()

    const new_trip_info = {
      trip_name: 'New Trip Name',
      trip_description: 'New Trip Description',
    }

    const res = await api
      .put(`/trips/update/${trip[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(new_trip_info)
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(res.body.trip_name).toEqual(new_trip_info.trip_name)
    expect(res.body.trip_description).toEqual(new_trip_info.trip_description)
  })

  test('Put - Add a member to a Trip', async () => {
    const password_hash = await bcrypt.hash('Test1234!', 10)
    const member_user = await new User({
      first_name: 'Member',
      last_name: 'User',
      username: 'MemberUser',
      email: 'member_user@test.com',
      password_hash,
    }).save()

    // Add new user to signed in user's friend
    await api
      .put(`/users/add_friend/${member_user._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Get trip to add member to
    const trip = await Trip.find({ trip_name: 'New Trip Name' })
      .populate('owner')
      .populate('members')
      .exec()

    const res = await api
      .put(`/trips/add_member/${trip[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ member_id: member_user._id.toString() })
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(res.body.members).toHaveLength(2)
  })

  test('DELETE - Delete a Trip', async () => {
    const trip = await Trip.find({ trip_name: 'New Trip Name' }).exec()

    const res = await api
      .delete(`/trips/delete/${trip[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(202)

    const trip_exists = await Trip.exists({ _id: trip[0]._id })

    expect(trip_exists).toBeFalsy()
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})
