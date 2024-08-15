const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// User/Login Routes

// Get Users
router.get('/', userController.get_all_users)

// Create User
router.post('/create', userController.create_user)

// Login User
router.post('/login', userController.login_user)

// Add friend
router.put('/add_friend/:id', userController.add_friend)

// Update User
router.put('/update/:id', userController.update_user)

// Get User by :id
router.get('/:id', userController.get_user)

module.exports = router
