const express = require('express')
const router = express.Router()
const eventController = require('../controllers/eventController')

// Event ROUTES

// Get Events
router.get('/', eventController.get_all_events)

// Create Event
router.post('/create', eventController.create_event)

// Update Trip
router.put('/update/:id', eventController.update_event)

// Update Trip
router.put('/add_payers/:id', eventController.update_event)

// Delete Trip
router.delete('/delete/:id', eventController.delete_event)

// Get Event by :id
router.get('/:id', eventController.get_event)

module.exports = router
