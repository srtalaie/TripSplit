const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const loginController = require('../controllers/loginController')

// USER/LOGIN ROUTES

// Get Users
router.get('/', userController.get_all_users)

// Create User
router.post('/create', userController.create_user)

// Login User
router.post('/login', loginController.login_user)

// Add Friend
router.put('/add_friend/:id', userController.add_friend)

// Remove Friend
router.put('/remove_friend/:id', userController.remove_friend)

// Update User
router.put('/update/:id', userController.update_user)

// Get User by :id
router.get('/:id', userController.get_user)

module.exports = router
