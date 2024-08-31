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
    console.log(trip.members.some(idCheck))

    return res.status(401).send({
      message: 'You cannot access this trip, you are not part of this trip.',
    })
  } else {
    return res.status(200).json(trip.events)
  }
})

// Get an Event in a Trip
exports.get_event = asyncHandler(async (req, res, next) => {})

// Create an Event
exports.create_event = [asyncHandler(async (req, res, next) => {})]

// Update an Event
exports.update_event = [asyncHandler(async (req, res, next) => {})]

// Delete Event
exports.delete_event = asyncHandler(async (req, res, next) => {})

// Add Payers
exports.add_payers = asyncHandler(async (req, res, next) => {})
