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

  test('POST - Create an Event', async () => {
    const trip = await Trip.find({ trip_name: 'Trip 1' }).exec()

    const new_event = {
      event_name: 'Event 1',
      event_description: 'Description for Event 1',
      cost: 400,
    }

    const res = await api
      .post(`/events/create/${trip[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(new_event)
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(res.body._id).toBeTruthy()
  })

  test('GET - Get all Events', async () => {
    const trip = await Trip.find({ trip_name: 'Trip 1' }).exec()

    const res = await api
      .get(`/events/${trip[0]._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body).toHaveLength(1)
  })

  test('GET - Get an Event', async () => {
    const trip = await Trip.find({ trip_name: 'Trip 1' }).exec()
    const event_id = trip[0].events[0]._id
    const event = await Event.findById(event_id)
      .populate('payee')
      .populate('payers')
      .populate('trip')
      .exec()

    const res = await api
      .get(`/events/${trip[0]._id.toString()}/${event_id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(JSON.stringify(res.body)).toEqual(JSON.stringify(event))
  })

  test('PUT - Update an Event', async () => {
    const trip = await Trip.find({ trip_name: 'Trip 1' }).exec()
    const event_id = trip[0].events[0]._id

    const new_event_info = {
      event_name: 'New Event',
      event_description: 'New Description',
      cost: 1000,
    }

    const res = await api
      .put(`/events/update/${trip[0]._id.toString()}/${event_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(new_event_info)
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(res.body.event_name).toEqual(new_event_info.event_name)
    expect(res.body.event_description).toEqual(new_event_info.event_description)
    expect(res.body.cost).toEqual(new_event_info.cost)
  })

  test('PUT - Add Payers to Event', async () => {
    const trip = await Trip.find({ trip_name: 'Trip 1' })
      .populate('members')
      .exec()
    const event_id = trip[0].events[0]._id
    const user = await User.find({ username: 'TripOwner' }).exec()

    const friends = user[0].friends

    const payers_array = {
      payersArr: [
        {
          payer: friends[0].toString(),
          split: 250,
        },
        {
          payer: friends[1].toString(),
          split: 250,
        },
        {
          payer: friends[2].toString(),
          split: 250,
        },
      ],
    }

    const res = await api
      .put(`/events/add_payers/${trip[0]._id.toString()}/${event_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(payers_array)
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(res.body.payers).toHaveLength(3)
  })

  test('DELETE - Delete and Event', async () => {
    const trip = await Trip.find({ trip_name: 'Trip 1' })
      .populate('members')
      .exec()
    const event_id = trip[0].events[0]._id

    const res = await api
      .delete(`/events/delete/${trip[0]._id.toString()}/${event_id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(202)

    const event_exists = await Trip.exists({ _id: event_id })

    expect(event_exists).toBeFalsy()
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})
