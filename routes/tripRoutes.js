const express = require('express')
const router = express.Router()
const tripController = require('../controllers/tripController')

// Trip Routes

// Get Trips
router.get('/', tripController.get_all_trips)

// Create Trip
router.post('/create', tripController.create_trip)

// Get User by :id
router.get('/:id', tripController.get_trip)

module.exports = router
