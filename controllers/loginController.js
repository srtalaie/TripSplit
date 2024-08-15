const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const asyncHandler = require('express-async-handler')
const { body, validationResult, oneOf } = require('express-validator')

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
