const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const Trip = require('../models/trip')
const User = require('../models/user')

const { body, validationResult, oneOf } = require('express-validator')

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
