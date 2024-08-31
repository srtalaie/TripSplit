const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')

// Event ROUTES

// Get All Events in a Trip
router.get('/:trip_id/', eventController.get_all_events)

// Create Event
router.post('/:trip_id/create', eventController.create_event)

// Update Trip
router.put('/:trip_id/update/:id', eventController.update_event)

// Update Trip
router.put('/:trip_id/add_payers/:id', eventController.update_event)

// Delete Trip
router.delete('/:trip_id/delete/:id', eventController.delete_event)

// Get An Event in a Trip by :id
router.get('/:trip_id/:id', eventController.get_event)

module.exports = router
