const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const Trip = require('../models/trip')
const User = require('../models/user')
const Event = require('../models/event')

const { body, validationResult, oneOf } = require('express-validator')

// Get all Trips
exports.get_all_trips = asyncHandler(async (req, res, next) => {
  const trips = await Trip.find({})
    .populate('members.member')
    .populate('owner')
    .populate('events')
    .exec()

  if (!trips) {
    return res.status(404).send({ message: 'Trips not found.' })
  } else {
    return res.status(200).json(trips)
  }
})

// Get a Trip
exports.get_trip = asyncHandler(async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  const trip = await Trip.findById(req.params.id)
    .populate('members.member')
    .populate('events')
    .populate('owner')
    .exec()

  const idCheck = (element) => element.member._id.toString() === decodedToken.id

  if (!trip) {
    return res.status(404).send({ message: 'Trip not found.' })
  } else if (decodedToken.id !== trip.owner._id.toString()) {
    return res.status(401).send({
      message:
        'You cannot access this trip, you are not the owner of this trip.',
    })
  } else if (trip.members.length > 0 && !trip.members.some(idCheck)) {
    return res.status(401).send({
      message: 'You cannot access this trip, you are not part of this trip.',
    })
  } else {
    return res.status(200).json(trip)
  }
})

// Create a Trip
exports.create_trip = [
  // Validate and sanitize user input
  body('trip_name')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Must provide a first name.'),
  body('trip_description').trim().escape().optional(),

  // Process request after validation
  asyncHandler(async (req, res, next) => {
    // Extract errors from validation
    const errors = validationResult(req)

    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!decodedToken.email) {
      return res.status(401).json({ error: 'Token missing or invalid.' })
    }

    const user = await User.findById(decodedToken.id).exec()

    const trip = new Trip({
      trip_name: req.body.trip_name,
      trip_description: req.body.trip_description,
      owner: user,
    })

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    } else {
      trip.members.push({ member: user._id })
      const savedTrip = await trip.save()
      const updatedUserTrips = user.trips.concat(savedTrip._id)
      await User.findByIdAndUpdate(decodedToken.id, { trips: updatedUserTrips })
      return res.status(201).json(savedTrip)
    }
  }),
]

// Update a Trip
exports.update_trip = [
  // Validate and sanitize user input
  oneOf(
    [
      body('trip_name')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('Must provide a first name.'),
      body('trip_description').trim().escape().optional(),
    ],
    { message: 'Please provide an updated details.' }
  ),

  // Process request after validation
  asyncHandler(async (req, res, next) => {
    // Extract errors from validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.email) {
      return res.status(401).json({ error: 'Token missing or invalid.' })
    }
    const [oldTrip, user] = await Promise.all([
      Trip.findById(req.params.id).exec(),
      User.findById(decodedToken.id).exec(),
    ])

    const trip = new Trip({
      trip_name: req.body.trip_name,
      trip_description: req.body.trip_description,
      events: oldTrip.events,
      members: oldTrip.members,
      owner: user._id,
      _id: oldTrip._id,
    })

    if (!oldTrip) {
      return res.send(404).send({ message: 'Could not find trip.' })
    } else if (decodedToken.id !== oldTrip.owner._id.toString()) {
      return res
        .send(401)
        .send({ message: "You are not authorized to update this trip's info." })
    } else {
      await Trip.findByIdAndUpdate(req.params.id, trip)
      const updated_trip = await Trip.findById(req.params.id)
        .populate('members.member')
        .populate('events')
        .populate('owner')
        .exec()
      return res.status(201).json(updated_trip)
    }
  }),
]

// Delete Trip
exports.delete_trip = asyncHandler(async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.email) {
    return res.status(401).json({ error: 'Token missing or invalid.' })
  }

  const [user, trip] = await Promise.all([
    User.findById(decodedToken.id).exec(),
    Trip.findById(req.params.id).exec(),
  ])

  if (!trip) {
    return res.status(404).send({
      message: 'Cannot find trip.',
    })
  } else if (user._id.toString() !== trip.owner._id.toString()) {
    return res.status(401).send({
      message:
        'You cannot delete this trip, only the owner of the trip can delete.',
    })
  } else {
    // Gather all user id's tied to the trip
    const member_ids = trip.members.map((element) =>
      element.member._id.toString()
    )

    await User.updateMany(
      { _id: { $in: [...member_ids] } },
      { $pull: { trips: req.params.id } }
    )

    // Remove all events that are part of the trip
    if (trip.events.length > 0) {
      await Event.deleteMany({ _id: { $in: [...trip.events] } })
    }

    await Trip.findByIdAndDelete(req.params.id)
    return res.status(202).send({ message: 'Successfully deleted trip.' })
  }
})

// Add Member to Trip
exports.add_member = asyncHandler(async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.email) {
    return res.status(401).json({ error: 'Token missing or invalid.' })
  }

  const [user, trip, friend] = await Promise.all([
    User.findById(decodedToken.id).exec(),
    Trip.findById(req.params.id).populate('members.member').exec(),
    User.findById(req.body.member_id).exec(),
  ])

  const memberIdCheck = (element) =>
    element.member._id.toString() === req.body.member_id

  if (!trip) {
    return res.status(404).send({
      message: 'Cannot find trip.',
    })
  } else if (user._id.toString() !== trip.owner._id.toString()) {
    return res.status(401).send({
      message:
        'You cannot add members to this trip, only the owner of the trip can add members to this trip.',
    })
  } else if (!req.body.member_id) {
    return res.status(400).send({
      message: 'Please provide a valid member to add.',
    })
  } else if (trip.members.some(memberIdCheck)) {
    return res.status(409).send({
      message: 'This member already exists.',
    })
  } else if (!user.friends.includes(req.body.member_id)) {
    return res.status(400).send({
      message: "You can only add members that are on your friend's list.",
    })
  } else {
    trip.members = trip.members.concat({ member: friend._id })
    friend.trips = friend.trips.concat(trip._id)
    await trip.save()
    await friend.save()
    const returned_trip = await Trip.findById(trip._id)
      .populate('members.member')
      .exec()
    return res.status(201).json(returned_trip)
  }
})
