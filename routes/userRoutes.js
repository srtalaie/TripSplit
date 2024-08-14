const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// User/Login Routes

// Create User
router.post('/create', userController.create_user)

// Login User
router.post('/login', userController.login_user)

module.exports = router
