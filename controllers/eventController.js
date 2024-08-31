const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const Trip = require('../models/trip')
const User = require('../models/user')
const Event = require('../models/event')

const { body, validationResult, oneOf } = require('express-validator')

// Get all Events in a Trip
exports.get_all_events = asyncHandler(async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  const trip = await Trip.findById(req.params.trip_id)
    .populate('members')
    .populate('events')
    .populate('owner')
    .exec()

  const idCheck = (element) => element.member.toString() === decodedToken.id

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
    return res.status(200).json(trip.events)
  }
})

// Get an Event in a Trip
exports.get_event = asyncHandler(async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  const event = await Event.findById(req.params.event_id)
    .populate('payee')
    .populate('payers')
    .populate('trip')
    .exec()

  const idCheck = (element) => element.payer.toString() === decodedToken.id

  if (!event) {
    return res.status(404).send({ message: 'Event not found.' })
  } else if (decodedToken.id !== event.payee.toString()) {
    return res.status(401).send({
      message:
        'You cannot access this event, you are not the payee of this event.',
    })
  } else if (event.payers.length > 0 && !event.payers.some(idCheck)) {
    return res.status(401).send({
      message: 'You cannot access this event, you are not part of this event.',
    })
  } else {
    return res.status(200).json(event)
  }
})

// Create an Event
exports.create_event = [
  // Validate and Sanitize user input
  body('event_name')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Must provide a first name.'),
  body('event_description').trim().escape().optional(),
  body('cost')
    .trim()
    .isDecimal()
    .escape()
    .withMessage('Must provide a total cost for the event.'),

  // Process request after validation
  asyncHandler(async (req, res, next) => {
    // Extract errors from validation
    const errors = validationResult(req)

    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!decodedToken.email) {
      return res.status(401).json({ error: 'Token missing or invalid.' })
    }

    const [user, trip] = await Promise.all([
      User.findById(decodedToken.id).exec(),
      Trip.findById(req.params.trip_id).exec(),
    ])

    const event = new Event({
      event_name: req.body.event_name,
      event_description: req.body.event_description,
      cost: req.body.cost,
      payee: user._id,
      trip: trip._id,
    })

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    } else {
      const savedEvent = await event.save()
      const updatedTripEvents = trip.events.concat(savedEvent._id)
      await Trip.findByIdAndUpdate(trip._id, { events: updatedTripEvents })
      return res.status(201).json(savedEvent)
    }
  }),
]

// Update an Event
exports.update_event = [asyncHandler(async (req, res, next) => {})]

// Delete Event
exports.delete_event = asyncHandler(async (req, res, next) => {})

// Add Payers
exports.add_payers = asyncHandler(async (req, res, next) => {})
