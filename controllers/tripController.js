const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const Trip = require('../models/trip')
const User = require('../models/user')
const Event = require('../models/event')

const { body, validationResult, oneOf } = require('express-validator')

// Get all Trips
exports.get_all_trips = asyncHandler(async (req, res, next) => {
  const trips = await Trip.find({})
    .populate('members')
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
    .populate('members')
    .populate('events')
    .populate('owner')
    .exec()

  const emailCheck = (element) => element.email === decodedToken.email

  if (!trip) {
    return res.status(404).send({ message: 'Trip not found.' })
  } else if (decodedToken.id !== trip.owner._id.toString()) {
    return res.status(401).send({
      message:
        'You cannot access this trip, you are not the owner of this trip.',
    })
  } else if (trip.members.length > 0 && !trip.members.some(emailCheck)) {
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
      owner: user._id,
    })

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    } else {
      trip.members.push(user._id)
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
      return res.status(201).json(trip)
    }
  }),
]
