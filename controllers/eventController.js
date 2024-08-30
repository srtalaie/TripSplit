const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const Trip = require('../models/trip')
const User = require('../models/user')
const Event = require('../models/event')

const { body, validationResult, oneOf } = require('express-validator')

// Get all Events
exports.get_all_events = asyncHandler(async (req, res, next) => {})

// Get an Event
exports.get_event = asyncHandler(async (req, res, next) => {})

// Create an Event
exports.create_event = [asyncHandler(async (req, res, next) => {})]

// Update an Event
exports.update_event = [asyncHandler(async (req, res, next) => {})]

// Delete Event
exports.delete_event = asyncHandler(async (req, res, next) => {})

// Add Payers
exports.add_payers = asyncHandler(async (req, res, next) => {})
