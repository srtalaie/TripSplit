const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')

// Event ROUTES

// Create Event
router.post('/create/:trip_id', eventController.create_event)

// Update Event
router.put('/update/:trip_id/:event_id', eventController.update_event)

// Add Payers to Event
router.put('/add_payers/:trip_id/:event_id', eventController.add_payers)

// Delete Event
router.delete('/delete/:trip_id/:event_id', eventController.delete_event)

// Get All Events in a Trip
router.get('/:trip_id', eventController.get_all_events)

// Get An Event in a Trip by :id
router.get('/:trip_id/:event_id', eventController.get_event)

module.exports = router
