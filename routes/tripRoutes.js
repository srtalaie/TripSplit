const express = require('express')
const router = express.Router()
const tripController = require('../controllers/tripController')

// TRIP ROUTES

// Get Trips
router.get('/', tripController.get_all_trips)

// Create Trip
router.post('/create', tripController.create_trip)

// Update Trip
router.put('/update/:id', tripController.update_trip)

// Add Member to Trip
router.put('/add_member/:id', tripController.add_member)

// Delete Trip
router.delete('/delete/:id', tripController.delete_trip)

// Get Trip by :id
router.get('/:id', tripController.get_trip)

module.exports = router
