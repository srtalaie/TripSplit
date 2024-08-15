const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Trip = require('../models/trip')

const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

// Passport strategy setup
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email })
        if (!user) {
          return done(null, false, {
            message: 'Incorrect username and/or password',
          })
        }
        if (!bcrypt.compare(password, user.password_hash)) {
          return done(null, false, {
            message: 'Incorrect username and/or password',
          })
        }
        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

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

// Login User
exports.login_user = [
  // Validate & Sanitize user input
  body('email')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Must provide a email.'),
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
    // Extract errors from above validation
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    } else {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          return next(err)
        }
        if (!user) {
          return res.status(401).send({ message: info })
        }
        const userInfoForToken = {
          email: user.email,
          id: user._id,
        }
        const token = jwt.sign(userInfoForToken, process.env.SECRET)
        return res.status(200).send({ token: token, email: user.email })
      })(req, res, next)
    }
  }),
]

// GET All Users
exports.get_all_users = asyncHandler(async (req, res, next) => {
  const users = await User.find({}).populate('trips').exec()
  if (!users) {
    return res.status(404).send({ message: 'Users not found.' })
  } else {
    return res.status(200).json(users)
  }
})

exports.get_user = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate('trips').exec()
  if (!user) {
    return res.status(404).send({ message: 'User not found.' })
  } else {
    return res.status(200).json(user)
  }
})
