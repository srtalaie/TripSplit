const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const Trip = require('../models/trip')
const User = require('../models/user')

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
    .exec()

  const emailCheck = (user) => user.email === decodedToken.email

  if (!trip) {
    return res.status(404).send({ message: 'Trip not found.' })
  } else if (!trip.members.some(emailCheck)) {
    return res.status(401).send({ message: 'You are not part of this trip.' })
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

    const user = await User.findOne({ email: decodedToken.email }).exec()

    const trip = new Trip({
      trip_name: req.body.trip_name,
      trip_description: req.body.trip_description,
      owner: user._id,
    })

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    } else {
      const savedTrip = await trip.save()
      return res.status(201).json(savedTrip)
    }
  }),
]
