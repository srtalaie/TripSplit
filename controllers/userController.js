const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const asyncHandler = require('express-async-handler')
const { body, validationResult, oneOf } = require('express-validator')

// Create User
exports.create_user = [
  // Validate and sanitize user input
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Must provide a first name.'),
  body('last_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Must provide a last name.'),
  body('username')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Must provide a username of at least 3 characters.'),
  body('email')
    .trim()
    .toLowerCase()
    .escape()
    .isEmail()
    .withMessage('Must provide a valid email.'),
  body('password')
    .trim()
    .escape()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must be at least 8 characters long, contain an upper and lower case character, and contain at least 1 special character and 1 number'
    ),

  // Process request after validation
  asyncHandler(async (req, res, next) => {
    // Extract errors from validation
    const errors = validationResult(req)

    const { first_name, last_name, username, email, password } = req.body

    // Hash passowrd
    const saltRounds = 10
    const password_hash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      first_name: first_name,
      last_name: last_name,
      username: username,
      email: email,
      password_hash: password_hash,
    })

    // Check to see if email or username is already in use or if there any additional errors
    const [existingUsername, existingEmailAddress] = await Promise.all([
      User.findOne({ username: username }).exec(),
      User.findOne({ email: email }).exec(),
    ])

    if (existingUsername || existingEmailAddress) {
      return res
        .status(409)
        .send({ message: 'Username or Email already exists.' })
    }

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    } else {
      const savedUser = await user.save()
      return res.status(201).json(savedUser)
    }
  }),
]

// GET All Users
exports.get_all_users = asyncHandler(async (req, res, next) => {
  const users = await User.find({}).populate('trips').populate('friends').exec()

  if (!users) {
    return res.status(404).send({ message: 'Users not found.' })
  } else {
    return res.status(200).json(users)
  }
})

// Get a User
exports.get_user = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate('trips')
    .populate('friends')
    .exec()

  if (!user) {
    return res.status(404).send({ message: 'User not found.' })
  } else {
    return res.status(200).json(user)
  }
})

// Add friend
exports.add_friend = asyncHandler(async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (!decodedToken.email) {
    return res.status(401).json({ error: 'Token missing or invalid.' })
  }

  const [user, friend] = await Promise.all([
    User.findById(decodedToken.id).populate('trips').populate('friends').exec(),
    User.findById(req.params.id).exec(),
  ])

  if (decodedToken.id !== user._id.toString()) {
    return res.status(401).json({
      error: 'You are not authorized to make changes to this profile.',
    })
  }

  const idCheck = (element) => element._id.toString() === friend._id.toString()

  if (!friend) {
    return res.status(404).send({ message: 'User not found.' })
  } else if (friend._id === user._id) {
    return res.status(406).send({ message: 'Cannot add yourself as a friend' })
  } else if (user.friends.some(idCheck)) {
    return res.status(409).send({ message: 'Friend already exists' })
  } else {
    user.friends = user.friends.concat(friend._id)
    friend.friends = friend.friends.concat(user._id)
    await user.save()
    await friend.save()
    return res.status(201).json(user)
  }
})

// Update Profile
exports.update_user = [
  // Validate and sanitize user input
  oneOf(
    [
      body('first_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Must provide a first name.'),
      body('last_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Must provide a last name.'),
      body('username')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('Must provide a username of at least 3 characters.'),
      body('email')
        .trim()
        .toLowerCase()
        .escape()
        .isEmail()
        .withMessage('Must provide a valid email.'),
      body('password')
        .trim()
        .escape()
        .isStrongPassword({
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage(
          'Password must be at least 8 characters long, contain an upper and lower case character, and contain at least 1 special character and 1 number'
        ),
    ],
    { message: 'Please provide an updated details.' }
  ),

  // Process after validation
  asyncHandler(async (req, res, next) => {
    // Extract errors from above validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const oldUser = await User.findById(req.params.id).exec()

    if (!decodedToken) {
      return res.status(401).send({ message: 'Token missing or invalid.' })
    } else if (oldUser.email !== decodedToken.email) {
      return res
        .status(401)
        .send({ message: 'You are not authorized to update this profile.' })
    }

    if (req.body.password) {
      // Hash new passowrd
      const saltRounds = 10
      const new_password_hash = await bcrypt.hash(req.body.password, saltRounds)
      return new_password_hash
    }

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password_hash: !req.body.password
        ? oldUser.password_hash
        : new_password_hash,
      friends: oldUser.friends,
      trips: oldUser.trips,
      _id: oldUser._id,
    })

    await User.findByIdAndUpdate(req.params.id, user)
    return res.status(201).json(user)
  }),
]

// Remove a Friend
exports.remove_friend = asyncHandler(async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.email) {
    return res.status(401).json({ error: 'Token missing or invalid.' })
  }

  const [user, friend] = await Promise.all([
    User.findById(decodedToken.id).populate('trips').populate('friends').exec(),
    User.findById(req.params.id).exec(),
  ])

  if (decodedToken.id !== user._id.toString()) {
    return res.status(401).json({
      error: 'You are not authorized to make changes to this profile.',
    })
  }

  // Filter out friend from user's friends list and remove user from friends' friends list
  const filteredFriendsUser = user.friends.filter(
    (friend) => friend._id.toString() !== req.params.id
  )
  const filteredFriendsFriend = friend.friends.filter(
    (friend) => friend._id.toString() !== decodedToken.id
  )

  if (!friend) {
    return res.status(404).send({ message: 'User not found.' })
  } else if (friend._id === user._id) {
    return res
      .status(406)
      .send({ message: 'Cannot remove yourself as a friend' })
  } else {
    user.friends = filteredFriendsUser
    friend.friends = filteredFriendsFriend
    await User.findByIdAndUpdate(decodedToken.id, user)
    await User.findByIdAndUpdate(friend._id, friend)
    return res.status(201).json(user)
  }
})
