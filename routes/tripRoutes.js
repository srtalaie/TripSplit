const express = require('express')
const router = express.Router()
const tripController = require('../controllers/tripController')

// User/Login Routes

// Get Users
router.get('/', tripController.get_all_trips)

// Get User by :id
router.get('/:id', tripController.get_trip)

module.exports = router
